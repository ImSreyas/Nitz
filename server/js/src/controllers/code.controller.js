import express from "express";
import { runCode } from "./language.controller.js";
import pool from "../config/db.js";

const app = express();
app.use(express.json());

export async function executeCode(req, res) {
  const { problemId, language, code } = req.body;

  if (!problemId || !language || !code) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "Missing required fields",
    });
  }

  try {
    // Fetch starter logic code
    const logicCodeQuery = `
      SELECT logic_code 
      FROM tbl_starter_code
      WHERE problem_id = $1
      AND language_id = (SELECT id FROM tbl_programming_languages WHERE name = $2)
    `;
    
    const { rows: logicCodeRows } = await pool.query(logicCodeQuery, [
      problemId,
      language,
    ]);

    if (logicCodeRows.length === 0) {
      return res.status(404).json({
        success: false,
        errorType: "starter_code_missing",
        message: "No starter code found for this language and problem.",
      });
    }

    const fullCode = code + "\n" + logicCodeRows[0].logic_code;

    // Fetch test cases
    const testCasesQuery = `SELECT * FROM tbl_test_cases WHERE problem_id = $1`;
    const { rows: testCasesRows } = await pool.query(testCasesQuery, [
      problemId,
    ]);

    if (testCasesRows.length === 0) {
      return res.status(404).json({
        success: false,
        errorType: "test_cases_missing",
        message: "No test cases found for this problem.",
      });
    }

    const results = [];
    let standardError = null; // Store runtime/syntax errors

    for (const testCase of testCasesRows) {
      const params = `${testCase.input.trim()} ${testCase.output.trim()}`;

      try {
        const result = await runCode(language.toLowerCase(), fullCode, params);

        results.push({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: result.output,
          success: result.success,
          error: result.error || null,
        });

        if (!result.success && !standardError) {
          standardError = {
            message: result.error || "Unknown execution error",
            details: result.details || null,
          };
        }
      } catch (executionError) {
        // Capture standard error from execution
        if (!standardError) {
          standardError = {
            message: executionError.error || "Execution failed",
            details: executionError.details || null,
          };
        }
      }
    }

    return res.status(200).json({
      success: true,
      results,
      standardError, // Send standard errors (syntax, runtime, etc.)
    });
  } catch (dbError) {
    console.error("Database Error:", dbError);
    return res.status(500).json({
      success: false,
      errorType: "server_error",
      message: "An unexpected server error occurred.",
      details: dbError.message,
    });
  }
}


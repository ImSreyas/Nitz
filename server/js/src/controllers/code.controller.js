import express from "express";
import { runCode } from "./language.controller.js";
import pool from "../config/db.js";

const app = express();
app.use(express.json());

export async function executeCode(req, res) {
  const { problemId, language, userCode, logicCode } = req.body;

  if (!problemId || !language || !userCode) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "Missing required fields",
    });
  }
  let fullCode = "";
  if (!logicCode) {
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

      fullCode = userCode + "\n" + logicCodeRows[0].logic_code;
    } catch (e) {
      console.log(e);
    }
  } else {
    fullCode = userCode + "\n" + logicCode;
  }

  console.log("Full code:", fullCode);

  try {
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
          actualOutput:
            result.output !== undefined
              ? result.output
              : result.success
              ? testCase.output.trim()
              : "Unknown",
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

export async function getStarterCode(req, res, context = "user") {
  const id = req.query.id;
  try {
    let query = "";
    if (context == "moderator") {
      query = `
        SELECT 
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'language_id', pl.id,
            'name', pl.name,
            'version', pl.version,
            'user_code', sc.user_code,
            'logic_code', sc.logic_code
        )) FILTER (WHERE pl.id IS NOT NULL), '[]') AS supported_languages

        FROM public.tbl_problems p

        -- Join allowed languages and programming languages
        LEFT JOIN public.tbl_allowed_languages al 
            ON p.id = al.problem_id
        LEFT JOIN public.tbl_programming_languages pl 
            ON al.language_id = pl.id

        -- Join starter code (fetching only user_code)
        LEFT JOIN public.tbl_starter_code sc 
            ON p.id = sc.problem_id AND pl.id = sc.language_id

        WHERE p.id = $1;
      `;
    } else {
      query = `
        SELECT 
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'language_id', pl.id,
            'name', pl.name,
            'version', pl.version,
            'user_code', sc.user_code
        )) FILTER (WHERE pl.id IS NOT NULL), '[]') AS supported_languages

        FROM public.tbl_problems p

        -- Join allowed languages and programming languages
        LEFT JOIN public.tbl_allowed_languages al 
            ON p.id = al.problem_id
        LEFT JOIN public.tbl_programming_languages pl 
            ON al.language_id = pl.id

        -- Join starter code (fetching only user_code)
        LEFT JOIN public.tbl_starter_code sc 
            ON p.id = sc.problem_id AND pl.id = sc.language_id

        WHERE p.id = $1;
      `;
    }
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      data: rows[0].supported_languages,
    });
  } catch (error) {
    // console.log("error fetching problem:", error);
    if (error.code === "22P02") {
      res.status(200).json({
        success: false,
        errorMessage: "Invalid problem ID",
        errorCode: error.code,
      });
    }
    // console.error("error fetching problems:", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function updateStarterCode(req, res) {
  const { problemId, selectedLanguage, codeType, code } = req.body;

  if (!problemId || !selectedLanguage || !codeType || !code) {
    return res.status(200).json({
      success: false,
      errorType: "validation_error",
      message: "Missing required fields",
    });
  }

  if (!["user_code", "logic_code"].includes(codeType)) {
    return res.status(200).json({
      success: false,
      errorType: "validation_error",
      message: "Invalid codeType. Must be 'user_code' or 'logic_code'.",
    });
  }

  try {
    const updateQuery = `
      UPDATE tbl_starter_code
      SET ${codeType} = $3
      WHERE problem_id = $1 AND language_id = (SELECT id FROM tbl_programming_languages WHERE LOWER(name) = LOWER($2));
    `;

    await pool.query(updateQuery, [problemId, selectedLanguage, code]);

    return res.status(200).json({
      success: true,
      message: `${codeType} updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating starter code:", error);
    return res.status(500).json({
      success: false,
      errorType: "server_error",
      message: "An unexpected server error occurred.",
      details: error.message,
    });
  }
}

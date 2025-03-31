import pool from "../config/db.js";

export async function getProblem(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM public.tbl_problems");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addProblem(req, res) {
  console.log(req.body);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      title,
      difficulty,
      problemType,
      competitionMode,
      topics,
      problemStatement,
      constraints,
      timeLimit,
      memoryLimit,
      inputFormat,
      outputFormat,
      testCases,
      starterCode,
      moderatorId,
    } = req.body;

    // 🔹 Insert into `tbl_problems`
    const insertProblemQuery = `
      INSERT INTO tbl_problems 
      (title, difficulty, problem_type, competition_mode, topics, problem_statement, constraints, 
      time_limit, memory_limit, input_format, output_format, moderator_id, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) 
      RETURNING id
    `;
    const problemResult = await client.query(insertProblemQuery, [
      title,
      difficulty,
      problemType,
      competitionMode,
      topics.split(",").map((item) => item.trim()),
      problemStatement,
      constraints,
      timeLimit,
      memoryLimit,
      inputFormat,
      outputFormat,
      moderatorId,
    ]);
    const problemId = problemResult.rows[0].id; // Get the generated problem ID

    // 🔹 Insert into `tbl_test_cases`
    const insertTestCasesQuery = `
      INSERT INTO tbl_test_cases (problem_id, input, output, explanation) 
      VALUES ($1, $2, $3, $4)
    `;
    for (const testCase of testCases) {
      await client.query(insertTestCasesQuery, [
        problemId,
        testCase.input,
        testCase.output,
        testCase.explanation || null,
      ]);
    }

    // 🔹 Insert into `tbl_starter_code`
    const insertStarterCodeQuery = `
      INSERT INTO tbl_starter_code (problem_id, language_id, code) 
      VALUES ($1, (SELECT id FROM tbl_programming_languages WHERE LOWER(name) = LOWER($2)), $3)
    `;
    for (const code of starterCode) {
      if (code.code) {
        await client.query(insertStarterCodeQuery, [
          problemId,
          code.language.toLowerCase(),
          code.code || null,
        ]);
      }
      }

    // 🔹 Insert into `tbl_allowed_languages`
    const insertAllowedLanguagesQuery = `
      INSERT INTO tbl_allowed_languages (problem_id, language_id) 
      VALUES ($1, (SELECT id FROM tbl_programming_languages WHERE LOWER(name) = LOWER($2)))
    `;
    for (const code of starterCode) {
      if (code.code) {
        await client.query(insertAllowedLanguagesQuery, [
          problemId,
          code.language,
        ]);
      }
    }

    await client.query("COMMIT");

    res
      .status(201)
      .json({
        success: true,
        message: "Problem added successfully!",
        problemId,
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Failed to add problem" });
  } finally {
    client.release();
  }
}

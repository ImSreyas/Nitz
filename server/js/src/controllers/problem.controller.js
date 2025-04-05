import pool from "../config/db.js";

export async function getProblems(req, res) {
  try {
    const query = `
      select 
        p.id,
        p.problem_number,
        p.title as problem_title,
        p.difficulty,
        u.username,
        p.created_at as added_date,
        p.topics
      from public.tbl_problems p
      left join public.tbl_moderators u on p.moderator_id = u.id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("error fetching problems:", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getProblem(req, res) {
  const id = req.query.id;
  try {
    const query = `
      WITH limited_test_cases AS (
          SELECT 
              tc.problem_id,
              jsonb_build_object(
                  'test_case_id', tc.id,
                  'input', tc.input,
                  'output', tc.output,
                  'explanation', tc.explanation
              ) AS test_case
          FROM public.tbl_test_cases tc
          WHERE tc.problem_id = $1
          ORDER BY tc.id
          LIMIT 3
      )

      SELECT 
          p.id AS problem_id,
          p.problem_number,
          p.title,
          p.difficulty,
          p.problem_type,
          p.competition_mode,
          p.topics,
          p.problem_statement,
          p.constraints,
          p.time_limit,
          p.memory_limit,
          p.input_format,
          p.output_format,
          p.moderator_id,
          p.created_at,

          -- Aggregate test cases from the limited subquery
          COALESCE(jsonb_agg(DISTINCT lt.test_case), '[]') AS test_cases

      FROM public.tbl_problems p

      -- Join the limited test cases
      LEFT JOIN limited_test_cases lt 
          ON p.id = lt.problem_id

      WHERE p.id = $1  

      GROUP BY p.id;
    `;
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      data: rows,
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

export async function getStarterCode(req, res) {
  const id = req.query.id;
  try {
    const query = `
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
      INSERT INTO tbl_starter_code (problem_id, language_id, user_code, logic_code) 
      VALUES ($1, (SELECT id FROM tbl_programming_languages WHERE LOWER(name) = $2), $3, $4)
    `;
    for (const code of starterCode) {
      if (code.logicCode || code.userCode) {
        console.log("Starter code language :", code.language);
        await client.query(insertStarterCodeQuery, [
          problemId,
          code.language.toLowerCase(),
          code.userCode || null,
          code.logicCode || null,
        ]);
      }
    }

    // 🔹 Insert into `tbl_allowed_languages`
    const insertAllowedLanguagesQuery = `
      INSERT INTO tbl_allowed_languages (problem_id, language_id) 
      VALUES ($1, (SELECT id FROM tbl_programming_languages WHERE LOWER(name) = LOWER($2)))
    `;
    for (const code of starterCode) {
      if (code.logicCode || code.userCode) {
        await client.query(insertAllowedLanguagesQuery, [
          problemId,
          code.language,
        ]);
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Problem added successfully!",
      problemId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(200).json({
        success: false,
        errorCode: error.code,
        errorMessage: "Problem with the same name already exist",
      });
    }
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Failed to add problem" });
  } finally {
    client.release();
  }
}

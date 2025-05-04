import pool from "../config/db.js";

export async function getProblems(req, res) {
  const id = req.query.id;
  try {
    let query = "";
    if (id) {
      query = `
        SELECT 
          p.id,
          p.problem_number,
          p.title as problem_title,
          p.difficulty,
          u.username,
          p.created_at as added_date,
          p.topics,
          p.status,
          p.publish_status
        FROM public.tbl_problems p
        LEFT JOIN public.tbl_moderators u ON p.moderator_id = u.id
        WHERE p.is_deleted = false AND u.id = '${id}'
        ORDER BY p.created_at DESC;
        ;
      `;
    } else {
      query = `
      select 
        p.id,
        p.problem_number,
        p.title as problem_title,
        p.difficulty,
        u.username,
        p.created_at as added_date,
        p.topics,
        p.status,
        p.publish_status
      from public.tbl_problems p
      left join public.tbl_moderators u on p.moderator_id = u.id
      WHERE p.is_deleted = false
      ORDER BY p.created_at DESC;
    `;
    }
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("error fetching problems:", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getProblemsList(req, res) {
  try {
    const query = `
      SELECT 
        p.*,
        m.name AS moderator_name,
        m.username AS moderator_username
      FROM public.tbl_problems p
      LEFT JOIN public.tbl_moderators m ON p.moderator_id = m.id
      ORDER BY p.created_at DESC;
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching problem list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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

export async function updateProblem(req, res) {
  console.log(req.body);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      problemId,
      testCaseDeleteArray,
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
    } = req.body;

    // 🔹 Delete test cases

    const deleteTestCaseQuery = `
      DELETE FROM tbl_test_cases
      WHERE id = $1
    `;

    for (const testCaseId of testCaseDeleteArray) {
      await client.query(deleteTestCaseQuery, [testCaseId]);
    }

    // 🔹 Update `tbl_problems`
    const updateProblemQuery = `
      UPDATE tbl_problems
      SET 
        title = $1,
        difficulty = $2,
        problem_type = $3,
        competition_mode = $4,
        topics = $5,
        problem_statement = $6,
        constraints = $7,
        time_limit = $8,
        memory_limit = $9,
        input_format = $10,
        output_format = $11
      WHERE id = $12
    `;
    await client.query(updateProblemQuery, [
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
      problemId,
    ]);

    // 🔹 Update or Insert `tbl_test_cases`
    const updateTestCaseQuery = `
      UPDATE tbl_test_cases
      SET input = $1, output = $2, explanation = $3
      WHERE id = $4
    `;
    const insertTestCaseQuery = `
      INSERT INTO tbl_test_cases (problem_id, input, output, explanation)
      VALUES ($1, $2, $3, $4)
    `;
    for (const testCase of testCases) {
      if (testCase.test_case_id) {
        // Update existing test case
        await client.query(updateTestCaseQuery, [
          testCase.input,
          testCase.output,
          testCase.explanation || null,
          testCase.test_case_id,
        ]);
      } else {
        // Insert new test case
        await client.query(insertTestCaseQuery, [
          problemId,
          testCase.input,
          testCase.output,
          testCase.explanation || null,
        ]);
      }
    }

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Problem updated successfully!",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(200).json({
        success: false,
        errorCode: error.code,
        errorMessage: "Problem with the same name already exists",
      });
    }
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Failed to update problem" });
  } finally {
    client.release();
  }
}

export async function deleteProblem(req, res) {
  const id = req.query.id;
  try {
    const query = `
      UPDATE public.tbl_problems
      SET is_deleted = true
      WHERE id = $1
    `;
    await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("error deleting problem:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function getPublishStatus(req, res) {
  const id = req.query.id;
  try {
    const query = `
      SELECT 
        p.publish_status
      FROM public.tbl_problems p
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      data: {
        status: rows[0].publish_status,
      },
    });
  } catch (error) {
    console.error("error fetching publish status:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function setPublishStatus(req, res) {
  const { problemId, status } = req.body;
  try {
    const query = `
      UPDATE public.tbl_problems
      SET publish_status = $1
      WHERE id = $2
    `;
    await pool.query(query, [status == "published" ? true : false, problemId]);
    res.status(200).json({
      success: true,
      message: "Publish status updated successfully",
    });
  } catch (error) {
    console.error("error updating publish status:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function getApprovalStatus(req, res) {
  const id = req.query.id;
  try {
    const query = `
      SELECT 
        p.status
      FROM public.tbl_problems p
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      data: {
        status: rows[0].publish_status,
      },
    });
  } catch (error) {
    console.error("error fetching approval status:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function setApprovalStatus(req, res) {
  const { problemId, status } = req.body;
  try {
    const query = `
      UPDATE public.tbl_problems
      SET status = $1
      WHERE id = $2
    `;
    await pool.query(query, [status, problemId]);
    res.status(200).json({
      success: true,
      message: "Approval status updated successfully",
    });
  } catch (error) {
    console.error("error updating publish status:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function addProblemSolution(req, res) {
  const { problemId, solution } = req.body;
  try {
    const query = `
      INSERT INTO public.tbl_solutions (problem_id, solution)
      VALUES ($1, $2)
      ON CONFLICT (problem_id)
      DO UPDATE SET solution = EXCLUDED.solution;
    `;
    await pool.query(query, [problemId, solution]);

    res.status(200).json({
      success: true,
      message: "Problem solution upserted successfully",
    });
  } catch (error) {
    console.error("Error upserting problem solution:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getProblemSolution(req, res) {
  const id = req.params.id;
  try {
    const query = `
      SELECT 
        s.solution
      FROM public.tbl_solutions s
      WHERE s.problem_id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    res.status(200).json({
      success: true,
      data: rows[0].solution,
    });
  } catch (error) {
    console.error("error fetching problem solution:", error);
    res.status(200).json({ success: false, message: "internal server error" });
  }
}

export async function getProblemDiscussions(req, res) {
  const { problemId } = req.params;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      message: "Problem ID is required.",
    });
  }

  try {
    const query = `
      SELECT 
        d.id AS discussion_id,
        d.problem_id,
        d.user_id,
        u.username AS user_name,
        d.message,
        d.blackpoints,
        d.posted_at
      FROM public.tbl_problem_discussion d
      LEFT JOIN public.tbl_users u ON d.user_id = u.id
      WHERE d.problem_id = $1
      ORDER BY d.posted_at DESC;
    `;

    const { rows } = await pool.query(query, [problemId]);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching problem discussions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function addProblemDiscussion(req, res) {
  const { problemId } = req.params;
  const { discussion, userId } = req.body;

  if (!problemId || !discussion || !userId) {
    return res.status(400).json({
      success: false,
      message: "Problem ID, discussion, and user ID are required.",
    });
  }

  try {
    const query = `
      INSERT INTO public.tbl_problem_discussion (problem_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING id AS discussion_id, problem_id, user_id, message, blackpoints, posted_at;
    `;

    const { rows } = await pool.query(query, [problemId, userId, discussion]);

    res.status(201).json({
      success: true,
      message: "Discussion added successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error adding problem discussion:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function fetchProblemAttendStatus(req, res) {
  const { problemId, userId } = req.query;

  if (!problemId) {
    return res.status(400).json({
      success: false,
      message: "Problem ID is required.",
    });
  }

  try {
    const query = `
      SELECT 
        p.status
      FROM public.tbl_problem_submissions p
      WHERE p.problem_id = $1 and p.user_id = $2;
    `;

    const { rows } = await pool.query(query, [problemId, userId]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Problem status not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching problem status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

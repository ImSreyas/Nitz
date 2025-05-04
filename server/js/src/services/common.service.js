import pool from "../config/db.js";

export async function getUserRole(id) {
  if (!id) {
    return {
      success: false,
      errorType: "validation_error",
      message: "User ID is required.",
    };
  }

  try {
    const query = `
      SELECT role 
      FROM public.tbl_user_roles 
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return {
        success: false,
        message: "User role not found.",
      };
    }

    return {
      success: true,
      data: rows[0].role,
    };
  } catch (error) {
    console.error("Error fetching user role:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error.message,
    };
  }
}

export async function saveCode(
  userId,
  language,
  userCode,
  logicCode,
  problemId
) {
  if (!userId || !language || !problemId) {
    return {
      success: false,
      errorType: "validation_error",
      message: "User ID, language, and problem ID are required.",
    };
  }

  try {
    const query = `
      INSERT INTO public.tbl_problem_submissions (problem_id, user_id, programming_language, user_code, logic_code)
      VALUES (
        $1, 
        $2, 
        (SELECT id FROM public.tbl_programming_languages WHERE LOWER(name) = LOWER($3)), 
        $4, 
        $5
      )
      ON CONFLICT (problem_id, user_id, programming_language)
      DO UPDATE SET 
        user_code = EXCLUDED.user_code,
        logic_code = EXCLUDED.logic_code,
        submitted_at = CURRENT_TIMESTAMP
      RETURNING id, problem_id, user_id, programming_language, user_code, logic_code, status, submitted_at;
    `;

    const { rows } = await pool.query(query, [
      problemId,
      userId,
      language,
      userCode || null,
      logicCode || null,
    ]);

    return {
      success: true,
      message: "Code saved successfully.",
      data: rows[0],
    };
  } catch (error) {
    console.error("Error saving code:", error);
    return {
      success: false,
      message: "Internal server error",
      error: error.message,
    };
  }
}

export async function saveSubmittedCode(
  userId,
  language,
  logicCode,
  userCode,
  problemId
) {
  if (!userId || !language || !problemId) {
    console.log({
      success: false,
      errorType: "validation_error",
      message: "User ID, language, and problem ID are required.",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Step 1: Insert or update the submission
    const submissionQuery = `
      INSERT INTO public.tbl_problem_submissions (problem_id, user_id, programming_language, user_code, logic_code, status)
      VALUES (
        $1, 
        $2, 
        (SELECT id FROM public.tbl_programming_languages WHERE LOWER(name) = LOWER($3)), 
        $4, 
        $5,
        'accepted'
      )
      ON CONFLICT (problem_id, user_id, programming_language)
      DO UPDATE SET 
        user_code = EXCLUDED.user_code,
        logic_code = EXCLUDED.logic_code,
        status = 'accepted',
        submitted_at = CURRENT_TIMESTAMP;
    `;
    await client.query(submissionQuery, [
      problemId,
      userId,
      language,
      userCode || null,
      logicCode || null,
    ]);

    // Step 2: Fetch the difficulty of the problem
    const difficultyQuery = `
      SELECT difficulty 
      FROM public.tbl_problems 
      WHERE id = $1;
    `;
    const { rows: difficultyRows } = await client.query(difficultyQuery, [
      problemId,
    ]);
    if (difficultyRows.length === 0) {
      throw new Error("Problem not found.");
    }
    const difficulty = difficultyRows[0].difficulty;

    // Step 3: Fetch the points for the difficulty level
    const pointsQuery = `
      SELECT points 
      FROM public.tbl_difficulty_points 
      WHERE difficulty = $1;
    `;
    const { rows: pointsRows } = await client.query(pointsQuery, [difficulty]);
    if (pointsRows.length === 0) {
      throw new Error("Difficulty points not found.");
    }
    const difficultyPoints = pointsRows[0].points;

    // Step 4: Check if an entry exists in the points table
    const pointsCheckQuery = `
      SELECT points 
      FROM public.tbl_points 
      WHERE problem_id = $1 AND user_id = $2;
    `;
    const { rows: pointsCheckRows } = await client.query(pointsCheckQuery, [
      problemId,
      userId,
    ]);

    if (pointsCheckRows.length === 0) {
      // Step 5: Insert new points entry if no existing entry
      const insertPointsQuery = `
        INSERT INTO public.tbl_points (problem_id, user_id, points)
        VALUES ($1, $2, $3);
      `;
      await client.query(insertPointsQuery, [
        problemId,
        userId,
        difficultyPoints,
      ]);
      await client.query("COMMIT");
      return difficultyPoints;
    } else {
      // Step 6: Update points if they differ
      const existingPoints = pointsCheckRows[0].points;
      if (existingPoints === difficultyPoints) {
        await client.query("COMMIT");
        return 0; 
      } else {
        const updatePointsQuery = `
          UPDATE public.tbl_points
          SET points = $1, submitted_at = CURRENT_TIMESTAMP
          WHERE problem_id = $2 AND user_id = $3;
        `;
        await client.query(updatePointsQuery, [
          difficultyPoints,
          problemId,
          userId,
        ]);
        await client.query("COMMIT");
        return difficultyPoints - existingPoints; // Return the change in points
      }
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving submitted code:", error);
    return 0;
  } finally {
    client.release();
  }
}

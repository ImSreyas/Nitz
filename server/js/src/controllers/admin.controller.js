import pool from "../config/db.js";

export async function getAllUsers(req, res) {
  try {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.username,
        u.email,
        u.blackpoints,
        u.points,
        u.points_today,
        u.points_this_week,
        u.points_this_month,
        u.points_this_year,
        t.tier_name,
        u.is_active,
        u.completed_1vs1_matches,
        u.completed_problems,
        u.created_at,
        u.is_blocked
      FROM public.tbl_users u
      LEFT JOIN public.tbl_tiers t ON u.tier = t.id
      ORDER BY u.created_at DESC;
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllModerators(req, res) {
  try {
    const query = `
      SELECT 
        m.id,
        m.username,
        m.name,
        m.email,
        m.permission,
        m.problems_added,
        m.blackpoints,
        m.created_at,
        m.is_blocked
      FROM public.tbl_moderators m
      ORDER BY m.created_at DESC;
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching moderators:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getDashboardDetails(req, res) {
  try {
    // Query to get total counts and current month's counts
    const query = `
      SELECT 
        -- Total counts
        (SELECT COUNT(*) FROM public.tbl_users) AS total_users,
        (SELECT COUNT(*) FROM public.tbl_moderators) AS total_moderators,
        (SELECT COUNT(*) FROM public.tbl_problems) AS total_problems,
        (SELECT COUNT(*) FROM public.tbl_reports) AS total_reports,

        -- Current month's counts
        (SELECT COUNT(*) FROM public.tbl_users WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS current_month_users,
        (SELECT COUNT(*) FROM public.tbl_moderators WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS current_month_moderators,
        (SELECT COUNT(*) FROM public.tbl_problems WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS current_month_problems,
        (SELECT COUNT(*) FROM public.tbl_reports WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS current_month_reports;
    `;

    const { rows } = await pool.query(query);

    const {
      total_users,
      total_moderators,
      total_problems,
      total_reports,
      current_month_users,
      current_month_moderators,
      current_month_problems,
      current_month_reports,
    } = rows[0];

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: parseInt(total_users, 10),
        totalModerators: parseInt(total_moderators, 10),
        totalProblems: parseInt(total_problems, 10),
        totalReports: parseInt(total_reports, 10),
        currentMonth: {
          users: parseInt(current_month_users, 10),
          moderators: parseInt(current_month_moderators, 10),
          problems: parseInt(current_month_problems, 10),
          reports: parseInt(current_month_reports, 10),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  const { username, name, email, blackpoints } = req.body;
  const { id } = req.params;

  // Validate the `id` field
  if (!id) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "User ID is required.",
    });
  }

  // Build the dynamic query based on provided fields
  const updates = [];
  const values = [];
  let index = 1;

  if (username) {
    updates.push(`username = $${index++}`);
    values.push(username);
  }
  if (name) {
    updates.push(`name = $${index++}`);
    values.push(name);
  }
  if (email) {
    updates.push(`email = $${index++}`);
    values.push(email);
  }
  if (blackpoints !== undefined) {
    updates.push(`blackpoints = $${index++}`);
    values.push(blackpoints);
  }

  // If no fields are provided to update, return an error
  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message:
        "At least one field (username, name, email, or blackpoints) must be provided to update.",
    });
  }

  values.push(id);

  try {
    // Construct the dynamic SQL query
    const query = `
      UPDATE public.tbl_users
      SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING id, username, name, email, blackpoints;
    `;

    const { rows } = await pool.query(query, values);

    // Check if the user was updated
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made.",
      });
    }

    // Return the updated user details
    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function updateModerator(req, res) {
  const { username, name, email, blackpoints } = req.body;
  const { id } = req.params;

  // Validate the `id` field
  if (!id) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "Moderator ID is required.",
    });
  }

  // Build the dynamic query based on provided fields
  const updates = [];
  const values = [];
  let index = 1;

  if (username) {
    updates.push(`username = $${index++}`);
    values.push(username);
  }
  if (name) {
    updates.push(`name = $${index++}`);
    values.push(name);
  }
  if (email) {
    updates.push(`email = $${index++}`);
    values.push(email);
  }
  if (blackpoints !== undefined) {
    updates.push(`blackpoints = $${index++}`);
    values.push(blackpoints);
  }

  // If no fields are provided to update, return an error
  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message:
        "At least one field (username, name, email, or blackpoints) must be provided to update.",
    });
  }

  values.push(id);

  try {
    // Construct the dynamic SQL query
    const query = `
      UPDATE public.tbl_moderators
      SET ${updates.join(", ")}
      WHERE id = $${index}
      RETURNING id, username, name, email, blackpoints;
    `;

    const { rows } = await pool.query(query, values);

    // Check if the moderator was updated
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Moderator not found or no changes made.",
      });
    }

    // Return the updated moderator details
    return res.status(200).json({
      success: true,
      message: "Moderator updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error updating moderator:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function blockUser(req, res) {
  const { id } = req.params; // User ID from the request parameters
  const { isBlocked } = req.body; // Boolean value to block or unblock the user

  // Validate the input
  if (!id) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "User ID is required.",
    });
  }

  if (typeof isBlocked !== "boolean") {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "isBlocked must be a boolean value (true or false).",
    });
  }

  try {
    // Update the is_blocked field in the database
    const query = `
      UPDATE public.tbl_users
      SET is_blocked = $1
      WHERE id = $2
      RETURNING id, username, name, email, is_blocked;
    `;

    const { rows } = await pool.query(query, [isBlocked, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User has been ${
        isBlocked ? "blocked" : "unblocked"
      } successfully.`,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function blockModerator(req, res) {
  const { id } = req.params;
  const { isBlocked } = req.body;

  // Validate the input
  if (!id) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "Moderator ID is required.",
    });
  }

  if (typeof isBlocked !== "boolean") {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "isBlocked must be a boolean value (true or false).",
    });
  }

  try {
    const query = `
      UPDATE public.tbl_moderators
      SET is_blocked = $1
      WHERE id = $2
      RETURNING id, username, name, email, is_blocked;
    `;

    const { rows } = await pool.query(query, [isBlocked, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Moderator not found or no changes made.",
      });
    }

    // Return the updated moderator details
    return res.status(200).json({
      success: true,
      message: `Moderator has been ${
        isBlocked ? "blocked" : "unblocked"
      } successfully.`,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error updating moderator block status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

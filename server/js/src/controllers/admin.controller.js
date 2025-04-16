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
        u.created_at
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
        m.created_at
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

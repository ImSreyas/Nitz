import pool from "../config/db.js";

export async function getUserPoints(req, res) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({
      success: false,
      errorType: "validation_error",
      message: "User ID is required.",
    });
  }

  try {
    const query = `
      SELECT points 
      FROM public.tbl_users 
      WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        errorType: "user_not_found",
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0].points,
    });
  } catch (error) {
    console.error("Error fetching user points:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

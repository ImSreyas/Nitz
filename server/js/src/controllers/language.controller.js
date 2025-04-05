import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPPORTED_LANGUAGES = {
  python: {
    extension: "py",
    image: "python-runner",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app python-runner python /app/${fileName} ${params}`,
  },
  javascript: {
    extension: "js",
    image: "node-runner",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app node-runner node /app/${fileName} ${params}`,
  },
};

export async function runCode(language, code, params = "") {
  return new Promise((resolve, reject) => {
    if (!SUPPORTED_LANGUAGES[language]) {
      return reject({ success: false, error: "Unsupported language" });
    }

    const id = uuid();
    const tempDir = path.join(__dirname, "..", "temp", id);
    const fileName = `run.${SUPPORTED_LANGUAGES[language].extension}`;
    const filePath = path.join(tempDir, fileName);

    try {
      // Create temp directory and write code file
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(filePath, code + "\n", { encoding: "utf8" });

      // Ensure params are passed as a safe string
      const sanitizedParams = Array.isArray(params)
        ? params.map((p) => `"${p}"`).join(" ")
        : params;

      const dockerRunCmd = SUPPORTED_LANGUAGES[language].runCmd(
        tempDir,
        fileName,
        sanitizedParams
      );

      exec(dockerRunCmd, (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);

          return reject({
            success: false,
            error: "Execution failed",
            details: stderr.trim() || error.message, // Send detailed error to frontend
          });
        }

        return resolve({
          success: stdout.trim()[0] === "1",
          output: stdout.trim().split(":").slice(1).join(" "),
          error: stderr.trim(),
        });
      });
    } catch (e) {
      console.error("Server error:", e);
      return reject({
        success: false,
        error: "Server error",
        details: e.message,
      });
    } finally {
      // Cleanup temp directory after execution
      setTimeout(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }, 10000);
    }
  });
}

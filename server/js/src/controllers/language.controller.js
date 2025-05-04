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
    image: "python:3.11-alpine",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app python:3.11-alpine python ${fileName} ${params}`,
  },
  java: {
    fileName: "Main",
    extension: "java",
    image: "openjdk:21-slim",
    runCmd: (tempDir, fileName, params) => {
      const baseName = path.basename(fileName, ".java");
      return (
        `docker run --rm -v ${tempDir}:/app -w /app openjdk:21-slim ` +
        `/bin/sh -c "javac ${fileName} && java ${baseName} ${params}"`
      );
    },
  },
  cpp: {
    fileName: "main",
    extension: "cpp",
    image: "gcc:13.2.0",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app gcc:13.2.0 ` +
      `/bin/sh -c "g++ ${fileName} -o main.out && ./main.out ${params}"`,
  },
  rust: {
    fileName: "main",
    extension: "rs",
    image: "rust:1.76",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app rust:1.76 ` +
      `/bin/sh -c "rustc ${fileName} -o main.out && ./main.out ${params}"`,
  },
  c: {
    fileName: "main",
    extension: "c",
    image: "gcc:13.2.0",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app gcc:13.2.0 ` +
      `/bin/sh -c "gcc ${fileName} -o main.out && ./main.out ${params}"`,
  },
  go: {
    fileName: "main",
    extension: "go",
    image: "golang:1.21",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app golang:1.21 ` +
      `go run ${fileName} ${params}`,
  },
  swift: {
    fileName: "main",
    extension: "swift",
    image: "swift:5.9",
    runCmd: (tempDir, fileName, params) =>
      `docker run --rm -v ${tempDir}:/app -w /app swift:5.9 ` +
      `swift ${fileName} ${params}`,
  },
  kotlin: {
    fileName: "Main",
    extension: "kt",
    image: "zenika/kotlin",
    runCmd: (tempDir, fileName, params) => {
      const baseName = path.basename(fileName, ".kt");
      return (
        `docker run --rm -v ${tempDir}:/app -w /app zenika/kotlin ` +
        `/bin/sh -c "kotlinc ${fileName} -include-runtime -d ${baseName}.jar && java -jar ${baseName}.jar ${params}"`
      );
    },
  },
};

export async function runCode(language, code, params = "") {
  return new Promise((resolve, reject) => {
    if (!SUPPORTED_LANGUAGES[language]) {
      return reject({ success: false, error: "Unsupported language" });
    }

    const id = uuid();
    const tempDir = path.join(__dirname, "..", "temp", id);
    const fileName = `${SUPPORTED_LANGUAGES[language].fileName || "run"}.${
      SUPPORTED_LANGUAGES[language].extension
    }`;
    const filePath = path.join(tempDir, fileName);

    try {
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(filePath, code + "\n", { encoding: "utf8" });

      const sanitizedParams = Array.isArray(params)
        ? params.map((p) => `"${p}"`).join(" ")
        : params;

      const dockerRunCmd = SUPPORTED_LANGUAGES[language].runCmd(
        tempDir,
        fileName,
        sanitizedParams
      );

      console.log("Executing command:", dockerRunCmd);

      exec(dockerRunCmd, (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);

          // Cleanup after error
          cleanupTempDir(tempDir);

          return reject({
            success: false,
            error: "Execution failed",
            details: stderr.trim() || error.message,
          });
        }

        console.log("Execution output:", stdout.trim());

        // Cleanup after success
        cleanupTempDir(tempDir);

        return resolve({
          success: stdout.trim()[0] === "1",
          output: stdout.trim().split(":").slice(1).join(" "),
          error: stderr.trim(),
        });
      });
    } catch (e) {
      console.error("Server error:", e);

      // Cleanup after server error
      cleanupTempDir(tempDir);

      return reject({
        success: false,
        error: "Server error",
        details: e.message,
      });
    }
  });
}

// Helper function to clean up the temporary directory
function cleanupTempDir(tempDir) {
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`Temporary directory ${tempDir} cleaned up.`);
  } catch (cleanupError) {
    console.error(
      `Error cleaning up temporary directory ${tempDir}:`,
      cleanupError.message
    );
  }
}

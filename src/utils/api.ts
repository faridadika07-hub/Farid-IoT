export const sendCommand = async (ip: string, path: string) => {
  if (!ip) throw new Error("IP Address is required");
  // Ensure we are making a cross-origin request
  const url = `http://${ip}${path}`;
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch", error);
    throw error;
  }
};

export const syncStatus = async (ip: string) => {
  if (!ip) throw new Error("IP Address is required");
  const res = await fetch(`http://${ip}/sync`, { method: "GET" });
  if (!res.ok) throw new Error("Network response was not ok");
  return await res.json();
};

export const parseVoiceCommand = (text: string) => {
  const cmd = text.toLowerCase();
  let path = null;
  let logText = "";

  if (cmd.includes("nyala") || cmd.includes("hidup") || cmd.includes("on")) {
    if (cmd.includes("variasi 1") || cmd.includes("variasi satu")) {
      path = "/variasi?mode=1"; logText = "Mengaktifkan Variasi 1";
    } else if (cmd.includes("variasi 2") || cmd.includes("variasi dua")) {
      path = "/variasi?mode=2"; logText = "Mengaktifkan Variasi 2";
    } else if (cmd.includes("semua")) {
      path = "/all?state=on"; logText = "Menyalakan Semua Lampu";
    } else if (cmd.includes("satu") || cmd.includes("1")) {
      path = "/relay?id=1&state=on"; logText = "Menyalakan Lampu 1";
    } else if (cmd.includes("dua") || cmd.includes("2")) {
      path = "/relay?id=2&state=on"; logText = "Menyalakan Lampu 2";
    } else if (cmd.includes("tiga") || cmd.includes("3")) {
      path = "/relay?id=3&state=on"; logText = "Menyalakan Lampu 3";
    } else if (cmd.includes("empat") || cmd.includes("4")) {
      path = "/relay?id=4&state=on"; logText = "Menyalakan Lampu 4";
    }
  } else if (cmd.includes("mati") || cmd.includes("off") || cmd.includes("stop") || cmd.includes("berhenti")) {
    if (cmd.includes("variasi") || cmd.includes("stop") || cmd.includes("berhenti")) {
      path = "/stop"; logText = "Menghentikan Variasi Lampu";
    } else if (cmd.includes("semua")) {
      path = "/all?state=off"; logText = "Mematikan Semua Lampu";
    } else if (cmd.includes("satu") || cmd.includes("1")) {
      path = "/relay?id=1&state=off"; logText = "Mematikan Lampu 1";
    } else if (cmd.includes("dua") || cmd.includes("2")) {
      path = "/relay?id=2&state=off"; logText = "Mematikan Lampu 2";
    } else if (cmd.includes("tiga") || cmd.includes("3")) {
      path = "/relay?id=3&state=off"; logText = "Mematikan Lampu 3";
    } else if (cmd.includes("empat") || cmd.includes("4")) {
      path = "/relay?id=4&state=off"; logText = "Mematikan Lampu 4";
    }
  }
  
  return { path, logText };
};

export const datasets = {
  "vehicle is car": {
    properties: [
      {
        name: "",
        features: ["Four Wheels", "Transports People", "Wings", "Yellow", "Blue"],
      },
      { classifier: true, name: "", features: ["Car"] },
    ],
    entries: [
      [1, 1, 0, 0, 1, 1],
      [1, 1, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0],
      [1, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 0],
    ],
  },

  "cancer recurrence": {
    properties: [
      { name: "Menopause", features: ["lt40", "ge40", "premeno"] },
      { name: "Inv-nodes", features: ["0-2", "3-5", "6-8"] },
      { name: "Deg-malig", features: ["1", "2", "3"] },
      { classifier: true, name: "", features: ["Recurrence"] },
    ],
    entries: [
      [0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
      [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
    ],
  }
};

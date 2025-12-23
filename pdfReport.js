(function () {
  "use strict";

  function sanitizeText(text) {
    return String(text || "").replace(/[^\x20-\x7E]/g, "");
  }

  window.generatePDFReport = function (questionReport, score, totalQuestions) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("PDF library failed to load.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    let y = 20;

    // ===== HEADER =====
    doc.setFontSize(18);
    doc.text("Child Story Learning Report", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 105, y, {
      align: "center",
    });
    y += 15;

    // ===== SCORE =====
    doc.setFontSize(14);
    doc.text(`Score: ${score} / ${totalQuestions}`, 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(
      "This report shows how the child answered questions during the story.",
      14,
      y
    );
    y += 12;

    // ===== QUESTION DETAILS =====
    questionReport.forEach((q, index) => {
      const questionText = `Q${index + 1}. ${sanitizeText(q.question)}`;
      const status = q.firstAttemptCorrect
        ? "Correct on first attempt"
        : `Correct after ${q.attempts} attempt(s)`;

      const wrapped = doc.splitTextToSize(questionText, 180);

      if (y + wrapped.length * 6 > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.text(wrapped, 14, y);
      y += wrapped.length * 6;

      doc.setFontSize(10);
      doc.text("Result: " + status, 14, y);
      y += 8;
    });

    // ===== FOOTER =====
    if (y > 260) doc.addPage();

    doc.setFontSize(10);
    doc.text(
      "Learning through interactive storytelling",
      105,
      285,
      { align: "center" }
    );
    doc.text(
      "© Bal Rashtra Chetna",
      105,
      292,
      { align: "center" }
    );

    // ===== SAFE OPEN (NOT FORCE DOWNLOAD) =====
    doc.save("Child_Story_Report.pdf");

  };
})();

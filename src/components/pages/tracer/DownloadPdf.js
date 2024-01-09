import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PDFreport = (reportData, year, course) => {
  console.log(course);
  const getCourseString = (course) => {
    switch (course) {
      case "BSIT":
        return "Bachelor of Science in Information Technology";
      case "BSMET":
        return "Bachelor of Science in Manufacturing Engineering Technology";
      case "BSNAME":
        return "Bachelor of Science in Naval Architecture and Marine Engineering";
      case "BSAMT":
        return "Bachelor of Science in Auto Mechanical Technology";
      case "BSETM":
        return "Bachelor of Science in Electrical Technology Management";
      case "BSESM":
        return "Bachelor of Science in Energy Systems and Management";
      default:
        return "";
    }
  };
  console.log("test", reportData);
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape
  const marginLeft = 10;
  // eslint-disable-next-line new-cap
  const document = new jsPDF(orientation, unit, size);
  const pageHeight =
    document.internal.pageSize.height || document.internal.pageSize.getHeight();
  const pageWidth =
    document.internal.pageSize.width || document.internal.pageSize.getWidth();

  // pdf header
  const headers = [
    ["Name", "Status", "Occupation", "Nature of Work", "State of Reasons"],
  ];

  // converting string array to actual array
  // const convertString = report.state_of_reasons
  //   .replace(/\[|\]/g, "")
  //   .split(",");

  const data = reportData?.map((report,index) => [
    index,
    `${report.user?.alumni.first_name} ${report.user?.alumni.middle_name} ${report.user?.alumni.last_name}`,
    report.status === "yes" ? "Employed" : "Unemployed",
    report.status === "yes" ? report.present_occupation : "N/A",
    report.status === "yes" ? report.line_of_business : "N/A",
    report.status === "no"
      ? report.state_of_reasons
          .replace(/\[|\]/g, "")
          .split(",")
          ?.map((data) => data)
      : "N/A",
  ]);

  const content = {
    theme: "grid",
    startY: 150,
    head: headers,
    body: data,
    margin: { left: 10, right: 10, top: 5 },
    headStyles: {
      halign: "center",
      fillColor: "#41B6E6",
      valign: "middle",
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center", valign: "middle", fontSize: 8 },
      1: { cellWidth: 90, halign: "center", valign: "middle", fontSize: 8 },
      2: { cellWidth: 90, halign: "center", valign: "middle", fontSize: 8 },
      3: { cellWidth: 90, halign: "center", valign: "middle", fontSize: 8 },
      4: { cellWidth: 90, halign: "center", valign: "middle", fontSize: 8 },
      5: { cellWidth: 190, halign: "center", valign: "middle", fontSize: 8 },
    },
    didDrawPage: () => {
      // Footer
      // @ts-ignore
      const pageCount = document.internal.getNumberOfPages();
      document.text(
        `Page ${String(pageCount)}`,
        10,
        document.internal.pageSize.height - 10
      );
    },
  };
  // Header
  document.setFontSize(14);
  document.setFont("bold");
  document.text(
    "University of Science and Technology of Southern Philippines",
    pageWidth / 2,
    40,
    "center"
  );

  document.setFontSize(10);
  document.text(
    "Alubijid | Cagayan de Oro | Jasaan | Oroquieta | Panaon",
    pageWidth / 2,
    60,
    "center"
  );

  document.setFontSize(14);
  document.text(getCourseString(course), pageWidth / 2, 100, "center");

  document.setFontSize(14);
  document.text(`Batch ${year}`, pageWidth / 2, 120, "center");

  document.setFontSize(14);
  document.text(`Prepared by: Hasan P. HadjiMalic`, 30, pageHeight - 100);

  //   document.text(
  //     `Report from ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`,
  //     marginLeft,
  //     115
  //   );
  document.addImage("static/icon2.png", "png", marginLeft, 5, 80, 80);

  // @ts-ignore
  autoTable(document, content);
  return document.save(`Alumni-Employed-Unemployed-${course}-${year}.pdf`);
};

export default PDFreport;

import jsPDF from 'jspdf';
import moment from 'moment';
import autoTable from 'jspdf-autotable';

const PDFreport = ( reportData, year, course ) => {
  console.log('test', reportData)
  const unit = 'pt';
  const size = 'A4'; // Use A1, A2, A3 or A4
  const orientation = 'portrait'; // portrait or landscape
  const marginLeft = 10;
  // eslint-disable-next-line new-cap
  const document = new jsPDF(orientation, unit, size);

  const headers = [
    [
      'First Name',
      'Middle Name',
      'Last Name',
      'Course',
      'Year Graduated',
      'Status'
    ],
  ];

  const data = reportData?.map((report) => [
    report.user?.alumni.first_name,
    report.user?.alumni.middle_name,
    report.user?.alumni.last_name,
    report.user?.alumni.course,
    report.user?.alumni.year_graduated,
    report.status === 'yes' ? 'Employed' : 'Unemployed'
  ]);

  const content = {
    theme: 'grid',
    startY: 130,
    head: headers,
    body: data,
    margin: { left: 10, right: 10, top: 5 },
    headStyles: {
      halign: 'center',
      fillColor: '#41B6E6',
      valign: 'middle',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
      1: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
      2: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
      3: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
      4: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
      5: { cellWidth: 95, halign: 'center', valign: 'middle', fontSize: 8 },
    },
    didDrawPage: () => {
      // Footer
      // @ts-ignore
      const pageCount = document.internal.getNumberOfPages();
      document.text(`Page ${  String(pageCount)}`, 10, document.internal.pageSize.height - 10);
    },
  };
  // Header
  document.setFontSize(12);
  document.text(`${course} - ${year}`, marginLeft, 100);
  document.text('Reports by: Admin', marginLeft, 120);
//   document.text(
//     `Report from ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`,
//     marginLeft,
//     115
//   );
  document.addImage(
    "static/test.png",
    "png",
    marginLeft,
    5,
    80,
    80
  );

  // @ts-ignore
  autoTable(document, content);
  return document.save(
    `Alumni-Employed-Unemployed-${course}-${year}.pdf`
  );
};

export default PDFreport;

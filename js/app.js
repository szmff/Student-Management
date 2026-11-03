/**
 * ===================================================================
 * نظام إدارة وتحليل نتائج الطلاب الأكاديمي
 * University Student Management & Academic Analytics System
 * Vanilla JavaScript implementation fulfilling all assignment criteria
 * ===================================================================
 */

// ===================================================================
// 1. DATA MODEL: Class Student (المتطلب الأساسي)
// ===================================================================
class Student {
  /**
   * Constructor for Student class
   * @param {string|number} seatNumber - رقم الجلوس
   * @param {string} name - اسم الطالب الرباعي
   * @param {number[]} scores - درجات المواد الثلاث [برمجة, هياكل, قواعد]
   * @param {number} attendance - نسبة الحضور (0 - 100)
   */
  constructor(seatNumber, name, scores, attendance, academicStatus = 'normal', academicNote = '') {
    this.academicStatus = ['normal', 'exempt', 'suspended', 'deferred', 'withdrawn'].includes(academicStatus) ? academicStatus : 'normal';
    this.academicNote = String(academicNote || '').trim();
    this.seatNumber = String(seatNumber).trim();
    this.name = String(name).trim();
    this.scores = Array.isArray(scores) ? scores.map(s => Number(s) || 0) : [0, 0, 0];
    this.attendance = Number(attendance) || 0;
  }

  /**
   * حساب المتوسط الحسابي للدرجات باستخدام reduce
   * مع حماية كاملة من القسمة على صفر
   * @returns {number}
   */
  calculateAverage() {
    // حماية القسمة على صفر في حال كانت مصفوفة الدرجات فارغة
    if (!this.scores || this.scores.length === 0) {
      return 0;
    }

    const total = this.scores.reduce((accumulator, currentScore) => {
      return accumulator + (Number(currentScore) || 0);
    }, 0);

    return Number((total / this.scores.length).toFixed(2));
  }

  /**
   * حساب التقدير بالحروف (A - F) باستخدام جمل الشرط if / else
   * @returns {string}
   */
  calculateGrade() {
    const avg = this.calculateAverage();

    if (avg >= 90) {
      return 'A';
    } else if (avg >= 80) {
      return 'B';
    } else if (avg >= 70) {
      return 'C';
    } else if (avg >= 60) {
      return 'D';
    } else if (avg >= 50) {
      return 'E';
    } else {
      return 'F';
    }
  }

  /**
   * تحديد النتيجة النهائية باستخدام المعامل المنطقي &&
   * شرط النجاح: المتوسط 50 فأكثر && الحضور 75% فأكثر
   * @returns {string} 'ناجح' | 'يحتاج مراجعة' | 'راسب'
   */
  getFinalResult() {
    const avg = this.calculateAverage();
    const att = this.attendance;

    const exceptionalStatuses = { exempt: 'معفى بقرار رسمي', suspended: 'محروم', deferred: 'مؤجل', withdrawn: 'منسحب' };
    if (this.academicStatus !== 'normal') return exceptionalStatuses[this.academicStatus] || 'يحتاج مراجعة';

    // استخدام المعامل المنطقي && للتحقق من شرطي النجاح معاً
    if (avg >= 50 && att >= 75) {
      return 'ناجح';
    } else if (avg >= 40 && avg < 50) {
      // الطالب في النطاق الحرج لمراجعة لجنة الرأفة
      return 'يحتاج مراجعة';
    } else if (avg >= 50 && att < 75) {
      // درجات مقبولة ولكن نسبة الحضور أقل من 75% تستوجب مراجعة الكنترول
      return 'يحتاج مراجعة';
    } else {
      return 'راسب';
    }
  }

  /**
   * أسماء المواد الدراسية الثلاث
   */
  static get subjectNames() {
    return ['برمجة الحاسوب', 'هياكل البيانات', 'قواعد البيانات'];
  }
}

// ===================================================================
// 2. SAMPLE DATA: البيانات التجريبية المعتمدة
// تشمل طلاباً متنوعين من بينهم طالبان في نطاق الرأفة (40-49)
// ===================================================================
const INITIAL_STUDENTS_DATA = [
  { seatNumber: "1001", name: "أحمد محمود السعيد", scores: [92, 88, 95], attendance: 96 },
  { seatNumber: "1002", name: "مريم حسن القحطاني", scores: [82, 85, 78], attendance: 90 },
  // طالب 1 لاختبار لجنة الرأفة: متوسط 46 (بين 40 و 49)
  { seatNumber: "1003", name: "عمر عبد الله الزهراني", scores: [44, 48, 46], attendance: 82 },
  // طالب 2 لاختبار لجنة الرأفة: متوسط 44.67 (بين 40 و 49)
  { seatNumber: "1004", name: "سارة طارق الفهد", scores: [42, 45, 47], attendance: 78 },
  { seatNumber: "1005", name: "خالد إبراهيم الدوسري", scores: [68, 74, 70], attendance: 85 },
  { seatNumber: "1006", name: "ياسمين كمال الشريف", scores: [58, 62, 60], attendance: 80 },
  { seatNumber: "1007", name: "زياد مصطفى الهواري", scores: [30, 35, 25], attendance: 60 },
  { seatNumber: "1008", name: "نور الدين العتيبي", scores: [85, 90, 88], attendance: 68 }
];

// القائمة الرئيسية للطلاب
let studentsList = [];

// ===================================================================
// 3. GRACE COMMITTEE LOGIC: معالجة لجنة الرأفة
// باستخدام الدوال الوظيفية المطلوبة: filter, map, reduce
// ===================================================================
function processGraceCommittee(list) {
  // 1. استخدام filter() لاستخراج الطلاب المتعثرين الذين متوسطهم بين 40 و 49
  const strugglingStudents = list.filter(student => {
    const avg = student.calculateAverage();
    return avg >= 40 && avg < 50 && student.academicStatus === 'normal';
  });

  // 2. استخدام map() لمعالجة متوسطات الطلاب وإضافة درجات الرأفة (+5)
  // دون تعديل درجات الطالب الأصلية
  const graceMarks = 5;
  const processedList = strugglingStudents.map(student => {
    const originalAvg = student.calculateAverage();
    // حساب المتوسط الجديد بإضافة 5 درجات وسقفه 100
    const newAvg = Math.min(100, Number((originalAvg + graceMarks).toFixed(2)));

    // تحديد التقدير الجديد بعد الرأفة
    let newGrade = 'F';
    if (newAvg >= 90) newGrade = 'A';
    else if (newAvg >= 80) newGrade = 'B';
    else if (newAvg >= 70) newGrade = 'C';
    else if (newAvg >= 60) newGrade = 'D';
    else if (newAvg >= 50) newGrade = 'E';
    else newGrade = 'F';

    // استخدام && للتحقق مما إذا كانت الرأفة تؤهله للترقية للنجاح
    const isPromoted = newAvg >= 50 && student.attendance >= 75;

    return {
      studentInstance: student,
      seatNumber: student.seatNumber,
      name: student.name,
      attendance: student.attendance,
      originalScores: [...student.scores],
      originalAvg: originalAvg,
      originalGrade: student.calculateGrade(),
      graceMarks: graceMarks,
      newAvg: newAvg,
      newGrade: newGrade,
      statusBefore: student.getFinalResult(),
      statusAfter: isPromoted ? 'ناجح (برأفة)' : 'راسب',
      isPromoted: isPromoted
    };
  });

  // 3. استخدام reduce() لحساب مجموع المتوسطات الجديدة
  const totalNewAverages = processedList.reduce((sum, item) => {
    return sum + item.newAvg;
  }, 0);

  // حساب المتوسط العام للطلاب المتعثرين بعد المعالجة مع حماية القسمة على صفر
  const eligibleCount = processedList.length;
  const overallProcessedAverage = eligibleCount > 0
    ? Number((totalNewAverages / eligibleCount).toFixed(2))
    : 0;

  // حساب المتوسط العام الأصلي لنفس الطلاب قبل الرأفة للمقارنة
  const totalOriginalAverages = processedList.reduce((sum, item) => {
    return sum + item.originalAvg;
  }, 0);
  const overallOriginalAverage = eligibleCount > 0
    ? Number((totalOriginalAverages / eligibleCount).toFixed(2))
    : 0;

  return {
    strugglingStudents: processedList,
    eligibleCount: eligibleCount,
    graceMarks: graceMarks,
    totalNewAverages: totalNewAverages,
    overallProcessedAverage: overallProcessedAverage,
    overallOriginalAverage: overallOriginalAverage,
    promotedCount: processedList.filter(s => s.isPromoted).length
  };
}

// ===================================================================
// 4. LOCAL STORAGE & DATA INITIALIZATION
// ===================================================================
const STORAGE_KEY = 'student_mgmt_system_data_v1';
const THEME_KEY = 'student_mgmt_theme_mode';

function loadStudentsData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        studentsList = parsed.map(item => new Student(item.seatNumber, item.name, item.scores, item.attendance, item.academicStatus, item.academicNote));
        return;
      }
    }
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
  }

  // Fallback to initial demo students
  resetToInitialDemoData(false);
}

function saveStudentsData() {
  try {
    const plainArray = studentsList.map(s => ({
      seatNumber: s.seatNumber,
      name: s.name,
      scores: s.scores,
      attendance: s.attendance,
      academicStatus: s.academicStatus,
      academicNote: s.academicNote
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plainArray));
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
  }
}

function resetToInitialDemoData(notify = true) {
  studentsList = INITIAL_STUDENTS_DATA.map(item => new Student(item.seatNumber, item.name, item.scores, item.attendance));
  saveStudentsData();
  if (notify) {
    showToast('تمت استعادة البيانات', 'تمت استعادة بيانات الطلاب التجريبية الأصلية بنجاح.', 'success');
  }
  refreshAllViews();
}

function clearAllData() {
  studentsList = [];
  saveStudentsData();
  showToast('تم مسح البيانات', 'تم تفريغ كافة سجلات الطلاب بنجاح.', 'warning');
  refreshAllViews();
}

// ===================================================================
// 5. CHART.JS INSTANCES & CONFIGURATION
// ===================================================================
let quickGradesChartInstance = null;
let quickResultsChartInstance = null;
let chartGradesDistInstance = null;
let chartResultsBreakdownInstance = null;
let chartAveragesScoresInstance = null;
let chartGraceImpactInstance = null;

function getChartThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    textColor: isDark ? '#cbd5e1' : '#475569',
    headingColor: isDark ? '#f8fafc' : '#0f172a',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    fontFamily: 'Cairo, sans-serif'
  };
}

function destroyAllCharts() {
  [
    quickGradesChartInstance,
    quickResultsChartInstance,
    chartGradesDistInstance,
    chartResultsBreakdownInstance,
    chartAveragesScoresInstance,
    chartGraceImpactInstance
  ].forEach(chart => {
    if (chart) chart.destroy();
  });
}

function updateCharts() {
  const theme = getChartThemeColors();
  Chart.defaults.font.family = theme.fontFamily;
  Chart.defaults.color = theme.textColor;

  // Grade counts calculation
  const gradeCounts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  studentsList.forEach(student => {
    const grade = student.calculateGrade();
    if (gradeCounts[grade] !== undefined) {
      gradeCounts[grade]++;
    }
  });

  // Results counts calculation
  let passedCount = 0;
  let reviewCount = 0;
  let failedCount = 0;

  studentsList.forEach(student => {
    const res = student.getFinalResult();
    if (res === 'ناجح') passedCount++;
    else if (res === 'يحتاج مراجعة') reviewCount++;
    else if (res === 'راسب') failedCount++;
  });

  // Grace Committee calculations
  const graceData = processGraceCommittee(studentsList);

  // -------------------------------------------------------------
  // Chart A: Quick Grades (Dashboard)
  // -------------------------------------------------------------
  const quickGradesCanvas = document.getElementById('quickGradesChart');
  if (quickGradesCanvas) {
    if (quickGradesChartInstance) quickGradesChartInstance.destroy();
    quickGradesChartInstance = new Chart(quickGradesCanvas, {
      type: 'bar',
      data: {
        labels: ['ممتاز (A)', 'جيد جداً (B)', 'جيد (C)', 'مقبول (D)', 'راسب (F)'],
        datasets: [{
          label: 'عدد الطلاب',
          data: [gradeCounts.A, gradeCounts.B, gradeCounts.C, gradeCounts.D, gradeCounts.F],
          backgroundColor: [
            '#10b981', // A
            '#3b82f6', // B
            '#0d9488', // C
            '#f59e0b', // D
            '#ef4444'  // F
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: theme.textColor },
            grid: { color: theme.gridColor }
          },
          x: {
            ticks: { color: theme.textColor },
            grid: { display: false }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Chart B: Quick Results Doughnut (Dashboard)
  // -------------------------------------------------------------
  const quickResultsCanvas = document.getElementById('quickResultsChart');
  if (quickResultsCanvas) {
    if (quickResultsChartInstance) quickResultsChartInstance.destroy();
    quickResultsChartInstance = new Chart(quickResultsCanvas, {
      type: 'doughnut',
      data: {
        labels: ['ناجح', 'يحتاج مراجعة', 'راسب'],
        datasets: [{
          data: [passedCount, reviewCount, failedCount],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111c30' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: theme.textColor, padding: 15 }
          }
        },
        cutout: '65%'
      }
    });
  }

  // -------------------------------------------------------------
  // Chart 1: Grade Distribution (Analytics View)
  // -------------------------------------------------------------
  const gradesDistCanvas = document.getElementById('chartGradesDistribution');
  if (gradesDistCanvas) {
    if (chartGradesDistInstance) chartGradesDistInstance.destroy();
    chartGradesDistInstance = new Chart(gradesDistCanvas, {
      type: 'bar',
      data: {
        labels: ['ممتاز (A)', 'جيد جداً (B)', 'جيد (C)', 'مقبول (D)', 'راسب (F)'],
        datasets: [{
          label: 'عدد الطلاب في الفئة',
          data: [gradeCounts.A, gradeCounts.B, gradeCounts.C, gradeCounts.D, gradeCounts.F],
          backgroundColor: ['#10b981', '#3b82f6', '#0d9488', '#f59e0b', '#ef4444'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: theme.textColor },
            grid: { color: theme.gridColor }
          },
          x: {
            ticks: { color: theme.textColor },
            grid: { display: false }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Chart 2: Final Results Breakdown (Analytics View)
  // -------------------------------------------------------------
  const resultsBreakdownCanvas = document.getElementById('chartResultsBreakdown');
  if (resultsBreakdownCanvas) {
    if (chartResultsBreakdownInstance) chartResultsBreakdownInstance.destroy();
    chartResultsBreakdownInstance = new Chart(resultsBreakdownCanvas, {
      type: 'pie',
      data: {
        labels: ['ناجح (نظامي)', 'يحتاج مراجعة (رأفة/غياب)', 'راسب'],
        datasets: [{
          data: [passedCount, reviewCount, failedCount],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111c30' : '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: theme.textColor, padding: 12 }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Chart 3: Student Averages & Attendance (Analytics View)
  // -------------------------------------------------------------
  const averagesScoresCanvas = document.getElementById('chartAveragesScores');
  if (averagesScoresCanvas) {
    if (chartAveragesScoresInstance) chartAveragesScoresInstance.destroy();
    const studentNames = studentsList.map(s => s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''));
    const averagesData = studentsList.map(s => s.calculateAverage());
    const attendanceData = studentsList.map(s => s.attendance);

    chartAveragesScoresInstance = new Chart(averagesScoresCanvas, {
      type: 'bar',
      data: {
        labels: studentNames,
        datasets: [
          {
            label: 'المتوسط الحسابي',
            data: averagesData,
            backgroundColor: 'rgba(37, 99, 235, 0.85)',
            borderRadius: 6
          },
          {
            type: 'line',
            label: 'نسبة الحضور %',
            data: attendanceData,
            borderColor: '#0d9488',
            backgroundColor: '#0d9488',
            borderWidth: 2,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: theme.textColor }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: theme.textColor },
            grid: { color: theme.gridColor }
          },
          x: {
            ticks: { color: theme.textColor, maxRotation: 45, minRotation: 0 },
            grid: { display: false }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Chart 4: Before vs After Grace Marks (Analytics View)
  // -------------------------------------------------------------
  const graceImpactCanvas = document.getElementById('chartGraceImpact');
  if (graceImpactCanvas) {
    if (chartGraceImpactInstance) chartGraceImpactInstance.destroy();

    const struggling = graceData.strugglingStudents;
    const labels = struggling.length > 0
      ? struggling.map(s => s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''))
      : ['لا يوجد طلاب في الرأفة حالياً'];
    const beforeData = struggling.length > 0 ? struggling.map(s => s.originalAvg) : [0];
    const afterData = struggling.length > 0 ? struggling.map(s => s.newAvg) : [0];

    chartGraceImpactInstance = new Chart(graceImpactCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'المتوسط قبل الرأفة',
            data: beforeData,
            backgroundColor: 'rgba(239, 68, 68, 0.75)',
            borderRadius: 6
          },
          {
            label: 'المتوسط بعد إضافة الرأفة (+5)',
            data: afterData,
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: theme.textColor }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: theme.textColor },
            grid: { color: theme.gridColor }
          },
          x: {
            ticks: { color: theme.textColor },
            grid: { display: false }
          }
        }
      }
    });
  }
}

// ===================================================================
// 6. UI RENDER FUNCTIONS
// ===================================================================

/**
 * تحديث الإحصائيات العامة وبطاقات KPI
 */
function updateKPIStats() {
  const total = studentsList.length;

  let passed = 0;
  let review = 0;
  let failed = 0;

  studentsList.forEach(student => {
    const res = student.getFinalResult();
    if (res === 'ناجح' || res.includes('معفى')) passed++;
    else if (res === 'يحتاج مراجعة' || res.includes('مؤجل')) review++;
    else if (res === 'راسب' || res.includes('محروم') || res.includes('منسحب')) failed++;
  });

  // حساب المتوسط العام لجميع الطلاب باستخدام reduce
  const totalScoresSum = studentsList.reduce((acc, student) => {
    return acc + student.calculateAverage();
  }, 0);

  // حماية القسمة على صفر
  const overallAvg = total > 0 ? Number((totalScoresSum / total).toFixed(2)) : 0;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const failRate = total > 0 ? Math.round((failed / total) * 100) : 0;

  // تحديث بطاقات الواجهة
  document.getElementById('stat-total-students').textContent = total;
  document.getElementById('stat-passed-students').textContent = passed;
  document.getElementById('stat-review-students').textContent = review;
  document.getElementById('stat-failed-students').textContent = failed;
  document.getElementById('stat-overall-average').textContent = overallAvg.toFixed(2);

  document.getElementById('stat-pass-rate').textContent = `${passRate}%`;
  document.getElementById('stat-fail-rate').textContent = `${failRate}%`;

  // شارات القائمة الجانبية
  document.getElementById('sidebar-student-count').textContent = total;

  // معالجة الرأفة لتحديث شارة التنبيه
  const graceData = processGraceCommittee(studentsList);
  document.getElementById('sidebar-grace-count').textContent = graceData.eligibleCount;
  document.getElementById('grace-alert-count').textContent = graceData.eligibleCount;

  // إحصائيات صفحة التحليل
  const excellentAndVeryGood = studentsList.filter(s => {
    const g = s.calculateGrade();
    return g === 'A' || g === 'B';
  }).length;
  const excellencePct = total > 0 ? Math.round((excellentAndVeryGood / total) * 100) : 0;

  const totalAttendance = studentsList.reduce((acc, s) => acc + s.attendance, 0);
  const avgAttendance = total > 0 ? Math.round(totalAttendance / total) : 0;

  const rescuePct = graceData.eligibleCount > 0
    ? Math.round((graceData.promotedCount / graceData.eligibleCount) * 100)
    : 0;

  document.getElementById('analytics-excellence-rate').textContent = `${excellencePct}%`;
  document.getElementById('analytics-pass-rate').textContent = `${passRate}%`;
  document.getElementById('analytics-attendance-avg').textContent = `${avgAttendance}%`;
  document.getElementById('analytics-grace-promoted-pct').textContent = `${rescuePct}%`;
}

/**
 * دالة مساعدة لإنشاء شارات التقدير
 */
function createGradeBadge(grade) {
  return `<span class="grade-badge grade-${grade}">${grade}</span>`;
}

/**
 * دالة مساعدة لإنشاء شارات النتيجة النهائية
 */
function createStatusPill(status) {
  if (status === 'ناجح' || status.includes('ناجح')) {
    return `<span class="status-pill status-passed"><i data-lucide="check" style="width: 14px; height: 14px;"></i> ${status}</span>`;
  } else if (status.includes('مراجعة') || status.includes('مؤجل')) {
    return `<span class="status-pill status-review"><i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> ${status}</span>`;
  } else if (status.includes('معفى')) {
    return `<span class="status-pill status-passed"><i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> ${status}</span>`;
  } else {
    return `<span class="status-pill status-failed"><i data-lucide="x" style="width: 14px; height: 14px;"></i> ${status}</span>`;
  }
}

/**
 * توليد الحروف الأولى لاسم الطالب كصورة رمزية
 */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + ' ' + parts[1][0]);
  }
  return parts[0] ? parts[0].substring(0, 2) : 'ط';
}

/**
 * عرض صفوف جدول الطلاب
 */
function renderStudentsTable() {
  const tbody = document.getElementById('main-students-tbody');
  const emptyState = document.getElementById('table-empty-state');
  if (!tbody) return;

  const searchTerm = (document.getElementById('table-search-input')?.value || '').trim().toLowerCase();
  const filterResult = document.getElementById('filter-result-select')?.value || 'ALL';
  const filterGrade = document.getElementById('filter-grade-select')?.value || 'ALL';
  const sortMode = document.getElementById('sort-average-select')?.value || 'DEFAULT';

  // تصفية الطلاب
  let filtered = studentsList.filter(student => {
    // تصفية البحث
    const matchSearch = student.name.toLowerCase().includes(searchTerm) ||
                        student.seatNumber.toLowerCase().includes(searchTerm);
    if (!matchSearch) return false;

    // تصفية النتيجة
    const res = student.getFinalResult();
    if (filterResult !== 'ALL' && res !== filterResult) {
      return false;
    }

    // تصفية التقدير
    const grade = student.calculateGrade();
    if (filterGrade !== 'ALL' && grade !== filterGrade) {
      return false;
    }

    return true;
  });

  // الترتيب
  if (sortMode === 'AVG_DESC') {
    filtered.sort((a, b) => b.calculateAverage() - a.calculateAverage());
  } else if (sortMode === 'AVG_ASC') {
    filtered.sort((a, b) => a.calculateAverage() - b.calculateAverage());
  } else if (sortMode === 'NAME_ASC') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }

  // في حال عدم وجود نتائج
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';
    if (window.lucide) lucide.createIcons();
    return;
  }

  emptyState.style.display = 'none';

  let html = '';
  filtered.forEach(student => {
    const avg = student.calculateAverage();
    const grade = student.calculateGrade();
    const result = student.getFinalResult();
    const originalIndex = studentsList.indexOf(student);

    // لون شريط المتوسط
    let barColor = 'var(--primary)';
    if (avg >= 85) barColor = 'var(--success)';
    else if (avg < 50) barColor = 'var(--danger)';
    else if (avg < 65) barColor = 'var(--warning)';

    html += `
      <tr>
        <td>
          <span class="student-seat-badge">${student.seatNumber}</span>
        </td>
        <td>
          <div class="student-name-cell">
            <div class="student-avatar-circle">${getInitials(student.name)}</div>
            <div class="student-meta">
              <span class="student-full-name" onclick="openStudentDetailsModal(${originalIndex})">${student.name}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="scores-inline">
            <span class="subject-score-pill" title="برمجة الحاسوب">
              <span>${student.scores[0]}</span>
              <span class="sub-name">برمجة</span>
            </span>
            <span class="subject-score-pill" title="هياكل البيانات">
              <span>${student.scores[1]}</span>
              <span class="sub-name">هياكل</span>
            </span>
            <span class="subject-score-pill" title="قواعد البيانات">
              <span>${student.scores[2]}</span>
              <span class="sub-name">قواعد</span>
            </span>
          </div>
        </td>
        <td>
          <div class="average-cell">
            <span class="average-number">${avg.toFixed(2)}</span>
            <div class="average-bar">
              <div class="average-bar-fill" style="width: ${Math.min(100, avg)}%; background-color: ${barColor};"></div>
            </div>
          </div>
        </td>
        <td>
          ${createGradeBadge(grade)}
        </td>
        <td>
          <div class="attendance-cell">
            <span class="attendance-dot ${student.attendance >= 75 ? 'attendance-high' : 'attendance-low'}"></span>
            <strong>${student.attendance}%</strong>
          </div>
        </td>
        <td>
          ${createStatusPill(result)}
        </td>
        <td style="text-align: center;">
          <div class="row-actions" style="justify-content: center;">
            <button class="row-action-btn" title="عرض الملف الأكاديمي" onclick="openStudentDetailsModal(${originalIndex})">
              <i data-lucide="eye"></i>
            </button>
            <button class="row-action-btn" title="تعديل البيانات" onclick="openEditStudentModal(${originalIndex})">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="row-action-btn delete-btn" title="حذف الطالب" onclick="confirmDeleteStudent(${originalIndex})">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

/**
 * عرض جدول الطلاب المختصر في لوحة التحكم
 */
function renderDashboardRecentTable() {
  const tbody = document.getElementById('dashboard-recent-tbody');
  if (!tbody) return;

  const recent = studentsList.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">لا يوجد طلاب مسجلون حتى الآن</td></tr>`;
    return;
  }

  let html = '';
  recent.forEach(student => {
    const avg = student.calculateAverage();
    const grade = student.calculateGrade();
    const result = student.getFinalResult();
    const originalIndex = studentsList.indexOf(student);

    html += `
      <tr>
        <td><span class="student-seat-badge">${student.seatNumber}</span></td>
        <td>
          <div class="student-name-cell">
            <div class="student-avatar-circle">${getInitials(student.name)}</div>
            <span class="student-full-name" onclick="openStudentDetailsModal(${originalIndex})">${student.name}</span>
          </div>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: var(--text-secondary); font-family: monospace;">
            [${student.scores.join(' - ')}]
          </span>
        </td>
        <td><strong>${avg.toFixed(2)}</strong></td>
        <td>${createGradeBadge(grade)}</td>
        <td><strong>${student.attendance}%</strong></td>
        <td>${createStatusPill(result)}</td>
        <td>
          <button class="row-action-btn" title="عرض التفاصيل" onclick="openStudentDetailsModal(${originalIndex})">
            <i data-lucide="eye"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

/**
 * عرض قسم لجنة الرأفة والمقارنة قبل وبعد
 */
function renderGraceCommitteeView() {
  const container = document.getElementById('grace-cards-container');
  if (!container) return;

  const graceData = processGraceCommittee(studentsList);

  // تحديث بطاقات إحصائيات الرأفة
  document.getElementById('grace-stat-eligible-count').textContent = graceData.eligibleCount;
  document.getElementById('grace-stat-orig-avg').textContent = graceData.overallOriginalAverage.toFixed(2);
  document.getElementById('grace-stat-new-avg').textContent = graceData.overallProcessedAverage.toFixed(2);

  if (graceData.strugglingStudents.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="background: var(--teal-light); color: var(--teal);">
          <i data-lucide="check-check"></i>
        </div>
        <h4 class="empty-title">لا يوجد طلاب بحاجة لرأفة حالياً</h4>
        <p class="empty-desc">جميع الطلاب المسجلين إما ناجحون بمعدلات فوق 50 أو لم يستوفوا شرط المدى الحرج (40 - 49 درجة).</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  let html = '';
  graceData.strugglingStudents.forEach(item => {
    const studentIdx = studentsList.indexOf(item.studentInstance);

    html += `
      <div class="grace-comparison-card">
        <div class="grace-card-student">
          <div class="student-avatar-circle" style="background: linear-gradient(135deg, var(--teal) 0%, var(--primary) 100%);">
            ${getInitials(item.name)}
          </div>
          <div class="student-meta">
            <span class="student-full-name" style="font-size: 1rem;" onclick="openStudentDetailsModal(${studentIdx})">${item.name}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">
              رقم الجلوس: <strong style="font-family: monospace;">${item.seatNumber}</strong> | نسبة الحضور: <strong>${item.attendance}%</strong>
            </span>
          </div>
        </div>

        <div class="grace-card-diff">
          <!-- قبل الرأفة -->
          <div class="before-after-box box-before">
            <span class="box-title">المتوسط قبل الرأفة</span>
            <span class="box-score" style="color: var(--danger);">${item.originalAvg.toFixed(2)}</span>
            <div style="margin-top: 0.25rem;">
              <span class="grade-badge grade-${item.originalGrade}" style="width: 24px; height: 24px; font-size: 0.75rem;">${item.originalGrade}</span>
            </div>
          </div>

          <!-- السهم والمؤشر -->
          <div class="arrow-indicator">
            <span style="background: var(--teal-light); border: 1px solid var(--teal-border); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); margin-bottom: 0.25rem;">
              +${item.graceMarks} درجات
            </span>
            <i data-lucide="arrow-left" style="width: 22px; height: 22px;"></i>
          </div>

          <!-- بعد الرأفة -->
          <div class="before-after-box box-after">
            <span class="box-title">المتوسط بعد المعالجة</span>
            <span class="box-score" style="color: var(--teal);">${item.newAvg.toFixed(2)}</span>
            <div style="margin-top: 0.25rem;">
              <span class="grade-badge grade-${item.newGrade}" style="width: 24px; height: 24px; font-size: 0.75rem;">${item.newGrade}</span>
            </div>
          </div>
        </div>

        <div class="grace-card-outcome">
          <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">القرار الأكاديمي النهائي:</span>
          ${item.isPromoted 
            ? `<span class="status-pill status-passed"><i data-lucide="award" style="width: 14px; height: 14px;"></i> تمت الترقية للنجاح</span>` 
            : `<span class="status-pill status-failed"><i data-lucide="x-circle" style="width: 14px; height: 14px;"></i> لم يستوفِ شرط 50%</span>`}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

/**
 * عرض كشف التقرير الرسمي للطباعة
 */
function renderOfficialReports() {
  const tbody = document.getElementById('official-report-tbody');
  const dateSpan = document.getElementById('report-date-str');
  if (!tbody) return;

  if (dateSpan) {
    const now = new Date();
    dateSpan.textContent = now.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  let html = '';
  studentsList.forEach((student, idx) => {
    const avg = student.calculateAverage();
    const grade = student.calculateGrade();
    const result = student.getFinalResult();

    html += `
      <tr>
        <td style="font-weight: 700;">${idx + 1}</td>
        <td style="font-family: monospace;">${student.seatNumber}</td>
        <td style="font-weight: 700;">${student.name}</td>
        <td>${student.scores[0]}</td>
        <td>${student.scores[1]}</td>
        <td>${student.scores[2]}</td>
        <td style="font-weight: 800;">${avg.toFixed(2)}</td>
        <td><strong>${grade}</strong></td>
        <td>${student.attendance}%</td>
        <td>${result}</td>
        <td>${student.academicNote || '—'}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * تحديث شامل لجميع الواجهات والرسوم
 */
function refreshAllViews() {
  updateKPIStats();
  renderStudentsTable();
  renderDashboardRecentTable();
  renderGraceCommitteeView();
  renderOfficialReports();
  updateCharts();
}

// ===================================================================
// 7. TOAST NOTIFICATIONS SYSTEM
// ===================================================================
function showToast(title, message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle-2';
  else if (type === 'error') iconName = 'alert-circle';
  else if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" aria-label="إغلاق التنبيه">
      <i data-lucide="x" style="width: 14px; height: 14px;"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 200);
  };

  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
}

// ===================================================================
// 8. MODAL HANDLERS & FORM VALIDATION
// ===================================================================

const modalStudentForm = document.getElementById('modal-student-form');
const studentForm = document.getElementById('student-form');
const formEditIndex = document.getElementById('form-edit-index');
const formSeatNumber = document.getElementById('form-seat-number');
const formName = document.getElementById('form-name');
const formScore1 = document.getElementById('form-score-1');
const formScore2 = document.getElementById('form-score-2');
const formScore3 = document.getElementById('form-score-3');
const formAttendance = document.getElementById('form-attendance');
const formAcademicStatus = document.getElementById('form-academic-status');
const formAcademicNote = document.getElementById('form-academic-note');

// Live Preview elements
const previewAvg = document.getElementById('form-preview-avg');
const previewGrade = document.getElementById('form-preview-grade');
const previewResult = document.getElementById('form-preview-result');

function updateFormLivePreview() {
  const s1 = Number(formScore1.value) || 0;
  const s2 = Number(formScore2.value) || 0;
  const s3 = Number(formScore3.value) || 0;
  const att = Number(formAttendance.value) || 0;

  const tempStudent = new Student('0', 'معاينة', [s1, s2, s3], att, formAcademicStatus?.value || 'normal');
  const avg = tempStudent.calculateAverage();
  const grade = tempStudent.calculateGrade();
  const res = tempStudent.getFinalResult();

  previewAvg.textContent = avg.toFixed(2);
  previewGrade.textContent = grade;
  previewResult.textContent = res;
}

[formScore1, formScore2, formScore3, formAttendance].forEach(input => {
  input.addEventListener('input', updateFormLivePreview);
});
formAcademicStatus?.addEventListener('change', updateFormLivePreview);

function openAddStudentModal() {
  formEditIndex.value = '-1';
  document.getElementById('modal-student-title').textContent = 'إضافة طالب جديد';
  document.getElementById('modal-icon-badge').innerHTML = '<i data-lucide="user-plus"></i>';
  studentForm.reset();
  formSeatNumber.disabled = false;
  if (formAcademicStatus) formAcademicStatus.value = 'normal';
  if (formAcademicNote) formAcademicNote.value = '';
  clearFormErrors();
  updateFormLivePreview();
  modalStudentForm.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function openEditStudentModal(index) {
  const student = studentsList[index];
  if (!student) return;

  formEditIndex.value = index;
  document.getElementById('modal-student-title').textContent = `تعديل بيانات الطالب: ${student.name}`;
  document.getElementById('modal-icon-badge').innerHTML = '<i data-lucide="edit-3"></i>';

  formSeatNumber.value = student.seatNumber;
  formSeatNumber.disabled = true; // رقم الجلوس ثابت عند التعديل
  formName.value = student.name;
  formScore1.value = student.scores[0];
  formScore2.value = student.scores[1];
  formScore3.value = student.scores[2];
  formAttendance.value = student.attendance;
  if (formAcademicStatus) formAcademicStatus.value = student.academicStatus || 'normal';
  if (formAcademicNote) formAcademicNote.value = student.academicNote || '';

  clearFormErrors();
  updateFormLivePreview();
  modalStudentForm.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

function closeStudentModal() {
  modalStudentForm.classList.remove('active');
}

function clearFormErrors() {
  document.getElementById('error-seat-number').style.display = 'none';
  document.getElementById('error-name').style.display = 'none';
  document.getElementById('error-scores').style.display = 'none';
  document.getElementById('error-attendance').style.display = 'none';
}

studentForm.addEventListener('submit', function (e) {
  e.preventDefault();
  clearFormErrors();

  const isEdit = Number(formEditIndex.value) >= 0;
  const editIdx = Number(formEditIndex.value);
  const seat = formSeatNumber.value.trim();
  const name = formName.value.trim();
  const s1 = Number(formScore1.value);
  const s2 = Number(formScore2.value);
  const s3 = Number(formScore3.value);
  const att = Number(formAttendance.value);

  let hasError = false;
  const exceptionalStatus = formAcademicStatus?.value && formAcademicStatus.value !== 'normal';
  if (exceptionalStatus && !formAcademicNote?.value.trim()) {
    showToast('بيانات القرار مطلوبة', 'أدخل سبب الحالة أو رقم القرار الرسمي قبل الحفظ.', 'warning');
    formAcademicNote?.focus();
    hasError = true;
  }

  // التحقق من رقم الجلوس وعدم تكراره
  if (!seat) {
    document.getElementById('error-seat-number').textContent = 'يرجى إدخال رقم الجلوس';
    document.getElementById('error-seat-number').style.display = 'block';
    hasError = true;
  } else if (!isEdit) {
    const exists = studentsList.some(s => s.seatNumber === seat);
    if (exists) {
      document.getElementById('error-seat-number').textContent = 'رقم الجلوس هذا مسجل بالفعل لطالب آخر';
      document.getElementById('error-seat-number').style.display = 'block';
      hasError = true;
    }
  }

  // التحقق من الاسم
  if (!name || name.length < 3) {
    document.getElementById('error-name').style.display = 'block';
    hasError = true;
  }

  // التحقق من الدرجات (0 - 100)
  if (isNaN(s1) || s1 < 0 || s1 > 100 || isNaN(s2) || s2 < 0 || s2 > 100 || isNaN(s3) || s3 < 0 || s3 > 100) {
    document.getElementById('error-scores').style.display = 'block';
    hasError = true;
  }

  // التحقق من الحضور (0 - 100)
  if (isNaN(att) || att < 0 || att > 100) {
    document.getElementById('error-attendance').style.display = 'block';
    hasError = true;
  }

  if (hasError) return;

  if (isEdit) {
    // تعديل الطالب الحالي
    studentsList[editIdx].name = name;
    studentsList[editIdx].scores = [s1, s2, s3];
    studentsList[editIdx].attendance = att;
    studentsList[editIdx].academicStatus = formAcademicStatus?.value || 'normal';
    studentsList[editIdx].academicNote = formAcademicNote?.value.trim() || '';
    showToast('تم التعديل', `تم تحديث بيانات الطالب (${name}) بنجاح.`, 'success');
  } else {
    // إضافة طالب جديد
    const newStudent = new Student(seat, name, [s1, s2, s3], att, formAcademicStatus?.value || 'normal', formAcademicNote?.value.trim() || '');
    studentsList.unshift(newStudent);
    showToast('طالب جديد', `تم تسجيل الطالب (${name}) برقم جلوس (${seat}) بنجاح.`, 'success');
  }

  saveStudentsData();
  closeStudentModal();
  refreshAllViews();
});

// Event Listeners for closing modal
document.getElementById('modal-student-close-btn').addEventListener('click', closeStudentModal);
document.getElementById('modal-student-cancel-btn').addEventListener('click', closeStudentModal);

// ===================================================================
// 9. STUDENT DETAILS MODAL
// ===================================================================
const modalStudentDetails = document.getElementById('modal-student-details');
const modalDetailsContent = document.getElementById('modal-details-content');

function openStudentDetailsModal(index) {
  const student = studentsList[index];
  if (!student) return;

  const avg = student.calculateAverage();
  const grade = student.calculateGrade();
  const result = student.getFinalResult();
  const subjects = Student.subjectNames;

  modalDetailsContent.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
      <div class="student-avatar-circle" style="width: 54px; height: 54px; font-size: 1.25rem;">
        ${getInitials(student.name)}
      </div>
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${student.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          رقم الجلوس: <strong style="font-family: monospace; color: var(--text-primary);">${student.seatNumber}</strong> | 
          الحالة: ${createStatusPill(result)}
        </p>
      </div>
    </div>

    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">تفاصيل درجات المواد الدراسية:</h4>
    <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem;">
      ${subjects.map((subName, i) => {
        const sc = student.scores[i];
        let color = sc >= 50 ? 'var(--primary)' : 'var(--danger)';
        return `
          <div style="background: var(--bg-surface-alt); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-weight: 700; font-size: 0.88rem;">${subName}</span>
              <strong style="color: ${color}; font-size: 1rem;">${sc} / 100</strong>
            </div>
            <div class="average-bar">
              <div class="average-bar-fill" style="width: ${sc}%; background-color: ${color};"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: var(--bg-surface-alt); padding: 1rem; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-color);">
      <div>
        <span style="display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">المتوسط الكلي</span>
        <strong style="font-size: 1.35rem; color: var(--text-primary);">${avg.toFixed(2)}</strong>
      </div>
      <div>
        <span style="display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">التقدير العام</span>
        <div style="margin-top: 0.2rem;">${createGradeBadge(grade)}</div>
      </div>
      <div>
        <span style="display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">نسبة الحضور</span>
        <strong style="font-size: 1.35rem; color: ${student.attendance >= 75 ? 'var(--success)' : 'var(--danger)'};">${student.attendance}%</strong>
      </div>
    </div>
    ${student.academicNote ? `<div class="student-decision-note"><strong>ملاحظات / رقم القرار:</strong> ${student.academicNote}</div>` : ''}
  `;

  modalStudentDetails.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

document.getElementById('modal-details-close-btn').addEventListener('click', () => modalStudentDetails.classList.remove('active'));
document.getElementById('modal-details-close-btn2').addEventListener('click', () => modalStudentDetails.classList.remove('active'));

// ===================================================================
// 10. CONFIRMATION DIALOG (FOR DELETE / RESET)
// ===================================================================
const modalConfirm = document.getElementById('modal-confirm');
const confirmTitle = document.getElementById('confirm-modal-title');
const confirmMessage = document.getElementById('confirm-modal-message');
const confirmOkBtn = document.getElementById('confirm-modal-ok');
const confirmCancelBtn = document.getElementById('confirm-modal-cancel');
let onConfirmAction = null;

function showConfirmDialog(title, message, callback) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  onConfirmAction = callback;
  modalConfirm.classList.add('active');
}

confirmCancelBtn.addEventListener('click', () => {
  modalConfirm.classList.remove('active');
  onConfirmAction = null;
});

confirmOkBtn.addEventListener('click', () => {
  if (typeof onConfirmAction === 'function') {
    onConfirmAction();
  }
  modalConfirm.classList.remove('active');
  onConfirmAction = null;
});

function confirmDeleteStudent(index) {
  const student = studentsList[index];
  if (!student) return;

  showConfirmDialog(
    'تأكيد حذف الطالب',
    `هل أنت متأكد من رغبتك في حذف بيانات الطالب (${student.name}) برقم جلوس (${student.seatNumber}) نهائياً؟`,
    () => {
      studentsList.splice(index, 1);
      saveStudentsData();
      showToast('تم الحذف', `تم حذف الطالب (${student.name}) بنجاح.`, 'success');
      refreshAllViews();
    }
  );
}

// ===================================================================
// 11. EXPORT TO CSV WITH ARABIC UTF-8 BOM
// ===================================================================
function exportStudentsToCSV() {
  if (studentsList.length === 0) {
    showToast('تنبيه', 'لا توجد بيانات طلاب لتصديرها.', 'warning');
    return;
  }

  // إضافة BOM لضمان فتح اللغة العربية في Excel بدون تشفير مشوه
  const BOM = '\uFEFF';
  const headers = ['رقم الجلوس', 'اسم الطالب', 'برمجة الحاسوب', 'هياكل البيانات', 'قواعد البيانات', 'المتوسط', 'التقدير', 'نسبة الحضور', 'الحالة الأكاديمية', 'ملاحظات القرار'];

  const rows = studentsList.map(s => [
    `"${s.seatNumber}"`,
    `"${s.name}"`,
    s.scores[0],
    s.scores[1],
    s.scores[2],
    s.calculateAverage().toFixed(2),
    s.calculateGrade(),
    `${s.attendance}%`,
    `"${s.getFinalResult()}"`,
    `"${String(s.academicNote || '').replaceAll('\"', '\"\"')}"`
  ]);

  const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `كشف_نتائج_الطلاب_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('تم التصدير', 'تم تصدير ملف CSV مع دعم اللغة العربية بنجاح.', 'success');
}

// ===================================================================
// 12. NAVIGATION & TABS SYSTEM
// ===================================================================
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-current-title');
const pageBreadcrumbSub = document.getElementById('page-breadcrumb-sub');

const viewTitles = {
  'dashboard': { title: 'لوحة التحكم الأكاديمية', sub: 'نظرة عامة على النتائج والمؤشرات' },
  'students': { title: 'سجل جميع الطلاب', sub: 'إدارة وتصفية درجات الطلاب والتحقق الأكاديمي' },
  'analytics': { title: 'التحليل الإحصائي والرسوم البيانية', sub: 'توزيع التقديرات والنسب المئوية التفاعلية' },
  'grace': { title: 'لجنة الرأفة والدعم الأكاديمي', sub: 'معالجة درجات الدعم للمتعثرين في النطاق الحرج (40 - 49)' },
  'reports': { title: 'التقارير الأكاديمية الرسمية', sub: 'طباعة كشف الدرجات المعتمد وتصدير السجلات' },
  'settings': { title: 'الإعدادات واللوائح الأكاديمية', sub: 'سلم التقديرات وإدارة البيانات التجريبية' }
};

function switchView(viewName) {
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === viewName);
  });

  views.forEach(section => {
    section.classList.toggle('active-view', section.id === `view-${viewName}`);
  });

  if (viewTitles[viewName]) {
    pageTitle.textContent = viewTitles[viewName].title;
    pageBreadcrumbSub.textContent = viewTitles[viewName].sub;
  }

  // إغلاق الشريط الجانبي في الموبايل
  document.getElementById('sidebar').classList.remove('mobile-open');

  // تحديث الرسوم عند فتح صفحة التحليل أو لوحة التحكم
  if (viewName === 'analytics' || viewName === 'dashboard') {
    setTimeout(updateCharts, 150);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-view');
    if (target) switchView(target);
  });
});

// Quick action buttons
document.getElementById('btn-goto-grace')?.addEventListener('click', () => switchView('grace'));
document.getElementById('btn-goto-all-students')?.addEventListener('click', () => switchView('students'));
document.getElementById('btn-quick-add-student')?.addEventListener('click', openAddStudentModal);
document.getElementById('btn-open-add-student-modal')?.addEventListener('click', openAddStudentModal);
document.getElementById('btn-export-csv-students')?.addEventListener('click', exportStudentsToCSV);
document.getElementById('btn-export-csv-reports')?.addEventListener('click', exportStudentsToCSV);
document.getElementById('btn-print-students')?.addEventListener('click', () => {
  switchView('reports');
  setTimeout(() => window.print(), 300);
});

// Search & Filter event listeners
const tableSearch = document.getElementById('table-search-input');
const globalSearch = document.getElementById('global-search-input');
const filterResult = document.getElementById('filter-result-select');
const filterGrade = document.getElementById('filter-grade-select');
const sortAverage = document.getElementById('sort-average-select');
const btnResetFilters = document.getElementById('btn-reset-filters');
const btnEmptyClear = document.getElementById('btn-empty-clear');

function handleSearch(e) {
  const val = e.target.value;
  if (tableSearch && tableSearch !== e.target) tableSearch.value = val;
  if (globalSearch && globalSearch !== e.target) globalSearch.value = val;

  // الانتقال لجدول الطلاب عند البحث من الهيدر العام
  if (e.target === globalSearch && val.trim().length > 0) {
    switchView('students');
  }

  renderStudentsTable();
}

tableSearch?.addEventListener('input', handleSearch);
globalSearch?.addEventListener('input', handleSearch);
filterResult?.addEventListener('change', renderStudentsTable);
filterGrade?.addEventListener('change', renderStudentsTable);
sortAverage?.addEventListener('change', renderStudentsTable);

function resetFilters() {
  if (tableSearch) tableSearch.value = '';
  if (globalSearch) globalSearch.value = '';
  if (filterResult) filterResult.value = 'ALL';
  if (filterGrade) filterGrade.value = 'ALL';
  if (sortAverage) sortAverage.value = 'DEFAULT';
  renderStudentsTable();
}

btnResetFilters?.addEventListener('click', resetFilters);
btnEmptyClear?.addEventListener('click', resetFilters);

// Settings Reset & Clear buttons
document.getElementById('btn-reset-demo-data')?.addEventListener('click', () => {
  showConfirmDialog(
    'استعادة البيانات التجريبية',
    'سيتم استبدال البيانات الحالية بالبيانات التجريبية الأصلية للتكليف (8 طلاب تشمل طلاب الرأفة). هل تريد الاستمرار؟',
    () => resetToInitialDemoData(true)
  );
});

document.getElementById('btn-clear-all-data')?.addEventListener('click', () => {
  showConfirmDialog(
    'مسح كافة البيانات',
    'هل أنت متأكد من مسح جميع سجلات الطلاب من النظام؟ لا يمكن التراجع عن هذا الإجراء.',
    () => clearAllData()
  );
});

// ===================================================================
// 13. DARK / LIGHT THEME TOGGLE
// ===================================================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}

themeToggleBtn?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon(newTheme);
  updateCharts();
});

// Mobile Sidebar Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');

mobileMenuBtn?.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('mobile-open');
  document.body.classList.toggle('sidebar-open', isOpen);
});

sidebarToggleBtn?.addEventListener('click', () => {
  sidebar.classList.remove('mobile-open');
  document.body.classList.remove('sidebar-open');
});

document.addEventListener('click', (event) => {
  if (document.body.classList.contains('sidebar-open') && !sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
    sidebar.classList.remove('mobile-open');
    document.body.classList.remove('sidebar-open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => modal.classList.remove('active'));
    sidebar.classList.remove('mobile-open');
    document.body.classList.remove('sidebar-open');
  }
});

// ===================================================================
// 14. INITIALIZATION ON DOM CONTENT LOADED
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadStudentsData();
  refreshAllViews();
  if (window.lucide) lucide.createIcons();
});

// Expose functions to global window for inline onclick handlers
window.openStudentDetailsModal = openStudentDetailsModal;
window.openEditStudentModal = openEditStudentModal;
window.confirmDeleteStudent = confirmDeleteStudent;

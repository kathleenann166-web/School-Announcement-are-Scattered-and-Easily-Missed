import type { Announcement, User, NotificationItem } from '../types.ts';

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'OMSC Mamburao Advisory: Class Suspension due to Severe Weather in Northern Occidental Mindoro',
    category: 'Emergency Announcements',
    priority: 'Emergency',
    summary: 'Classes across all levels at OMSC Mamburao Campus are suspended immediately in compliance with MDRRMO Mamburao storm advisory.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Office of the Campus Director & Campus DRRM Committee
Brgy. Tayamaan, Mamburao, Occidental Mindoro 5106

MEMORANDUM CIRCULAR NO. 2026-MAMB-042
TO: ALL OMSC MAMBURAO STUDENTS, FACULTY, AND ADMINISTRATIVE STAFF
SUBJECT: SUSPENSION OF CLASSES AND CAMPUS ACTIVITIES DUE TO TROPICAL CYCLONE ADVISORY

Following the severe weather bulletin from PAGASA and the official storm warning from the Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Mamburao, the Office of the Campus Director hereby declares the SUSPENSION OF ALL CLASSES AND CAMPUS ACTIVITIES at OMSC Mamburao Campus, Brgy. Tayamaan, effective immediately.

Campus Directives:
1. All face-to-face classes, teaching demonstrations for CTE, laboratory experiments, and student club meetings at the Tayamaan campus are deferred.
2. Students residing in boarding houses near riverways or low-lying coastal areas of Mamburao are advised to coordinate with campus DRRM personnel and local barangay officials.
3. Keep emergency devices charged and monitor official OMSC Mamburao Campus social media and this central announcement portal for re-opening notices.
4. Campus gates in Tayamaan are closed to non-essential personnel until safety clearance is issued.`,
    authorName: 'Dr. Arnulfo T. Ramos',
    authorRole: 'Campus Director, OMSC Mamburao Campus',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'OMSC_Mamburao_Memo_Weather_Suspension.pdf', size: '1.2 MB', type: 'application/pdf' },
      { name: 'MDRRMO_Mamburao_Emergency_Hotlines.pdf', size: '480 KB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'OMSC', 'Tayamaan', 'Weather', 'Typhoon', 'Suspension'],
    isPinned: true,
    viewsCount: 1720,
    readByStudentIds: ['user-student-1', 'user-student-2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'OMSC Mamburao Midterm Examination Schedule & Room Assignments (AY 2026-2027)',
    category: 'Examination Schedules',
    priority: 'Important',
    summary: 'Midterm exams begin next Monday at OMSC Mamburao Campus for CTE, CBAM, CAST, CCJE, and Senior High School.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Office of the Campus Registrar & Academic Coordinator
Brgy. Tayamaan, Mamburao, Occidental Mindoro

Notice to all bona fide students of OMSC Mamburao Campus:
The Midterm Examination Schedule for the 1st Semester of Academic Year 2026-2027 has been finalized and released.

Examination Guidelines:
• Present your validated OMSC Student ID and Midterm Permit stamped by the Mamburao Campus Cashier.
• Room assignments are posted on the bulletin boards of the Academic Building and the Tayamaan Main Lobby.
• Cellular phones, smart watches, and unauthorized notes are strictly prohibited inside examination rooms.
• Be seated at least 15 minutes before your scheduled examination period. Proctors will enforce the strict no-permit, no-exam policy.`,
    authorName: 'Prof. Marcus Vance',
    authorRole: 'Office of the Campus Registrar, OMSC Mamburao',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    location: 'OMSC Mamburao Academic Building & Testing Rooms, Brgy. Tayamaan',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'OMSC_Mamburao_Midterm_Timetable_AY2026.pdf', size: '2.5 MB', type: 'application/pdf' },
      { name: 'Mamburao_Room_Assignments_Building_1_and_2.pdf', size: '890 KB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'Exams', 'Midterms', 'Academics', 'CTE', 'CBAM', 'CAST'],
    isPinned: true,
    viewsCount: 940,
    readByStudentIds: ['user-student-1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Enrollment Announcement: Second Semester Online Pre-Registration & Subject Enlistment',
    category: 'Enrollment',
    priority: 'Urgent',
    summary: 'Online pre-enlistment is now open for all year levels at OMSC Mamburao Campus. Clear liabilities before the deadline.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Office of the Campus Registrar & Student Information System (SIS)
Brgy. Tayamaan, Mamburao, Occidental Mindoro

Online enrollment procedures for the upcoming Second Semester, Academic Year 2026-2027:

Enrollment Guidelines for Mamburao Campus Students:
1. Secure library clearance from the Mamburao Campus Library and verify financial standing with the Accounting Counter.
2. Log into your OMSC SIS Student Portal account and verify your pre-advised course loads.
3. For irregular students and shifters, coordinate directly with your department chairperson (CTE, CBAM, CAST, CCJE) in the Mamburao Faculty Office.
4. Beneficiaries under the Universal Access to Quality Tertiary Education Act (RA 10931) must submit their signed Certificate of Registration (COR) validation slip.

The deadline for regular pre-enlistment is strictly next Friday at 5:00 PM.`,
    authorName: 'Maria Elena Santos',
    authorRole: 'Campus Registrar, OMSC Mamburao',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'Mamburao_Campus_Enrollment_Flowchart.pdf', size: '1.7 MB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'Enrollment', 'Registrar', 'Registration', 'RA10931'],
    isPinned: false,
    viewsCount: 780,
    readByStudentIds: ['user-student-1', 'user-student-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ann-4',
    title: 'OMSC Mamburao Green Campus Initiative: Coastal & Campus Clean-Up in Tayamaan',
    category: 'School Activities',
    priority: 'Normal',
    summary: 'Join fellow Mamburao Tamaraws in coastal conservation and tree planting around the Tayamaan campus grounds.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Office of Student Affairs & Services (OSAS) & Supreme Student Council
Brgy. Tayamaan, Mamburao, Occidental Mindoro

All students, student organizations, and faculty members of OMSC Mamburao Campus are invited to participate in the quarterly Mamburao Environmental Stewardship Drive.

Activities include:
• Coastal clean-up along the Tayamaan coastal boundary.
• Planting native shade trees and mangrove seedlings in designated zones.
• Segregation of recyclables and electronic waste in cooperation with the Mamburao Municipal Environment Office.

Participants will receive volunteer certificates for Community Service hours and free refreshments. Assembly is at 6:30 AM at the OMSC Mamburao Campus Quadrangle.`,
    authorName: 'Engr. David Soriano',
    authorRole: 'OSAS Coordinator, OMSC Mamburao',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    location: 'OMSC Mamburao Campus Quadrangle & Tayamaan Coastal Area',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'Mamburao_CleanUp_Zones_Map.pdf', size: '1.1 MB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'Tayamaan', 'CleanUp', 'OSAS', 'Environment'],
    isPinned: false,
    viewsCount: 470,
    readByStudentIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'ann-5',
    title: 'OMSC Mamburao Supreme Student Council (SSC) General Assembly & Club Accreditation',
    category: 'Student Affairs',
    priority: 'Important',
    summary: 'Mandatory assembly for all student organization officers, class presidents, and campus publication staff.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Supreme Student Council (SSC) - Mamburao Chapter
Brgy. Tayamaan, Mamburao, Occidental Mindoro

The SSC Mamburao Chapter convenes the General Assembly of student organizations and representatives from the College of Teacher Education (CTE), Business Administration (CBAM), Technology (CAST), and Criminology (CCJE).

Meeting Agenda:
1. Presentation and ratification of the Mamburao Campus Activity Calendar for 2026.
2. Guidelines on student organization accreditation and activity liquidation reports.
3. Preparations for the Mamburao Campus Intramural Meet.
4. Student welfare dialogue with the Campus Director.`,
    authorName: 'Clarisse Dizon',
    authorRole: 'SSC Mamburao Chapter President',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
    location: 'Mamburao Campus Audio-Visual Hall (AVR), 2nd Floor Admin Building',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'SSC_Mamburao_Assembly_Agenda.pdf', size: '390 KB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'SSC', 'StudentCouncil', 'StudentAffairs'],
    isPinned: false,
    viewsCount: 560,
    readByStudentIds: ['user-student-2'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'ann-6',
    title: 'OMSC Mamburao Annual Academic & Cultural Festival 2026',
    category: 'Events',
    priority: 'Normal',
    summary: 'Showcasing student talent in literature, arts, technology exhibitions, and cultural dance competitions.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Campus Socio-Cultural Affairs Committee & Academic Council
Brgy. Tayamaan, Mamburao, Occidental Mindoro

Get ready for the biggest campus celebration of the year! OMSC Mamburao Campus proudly presents the 2026 Campus Academic & Cultural Festival.

Highlights of the Festival:
• Inter-Department Debate Championship (CTE vs. CBAM vs. CAST vs. CCJE)
• IT & Software Solutions Showcase by CAST Students
• Traditional Mangyan & Folkloric Dance Competitions
• Battle of the Bands and Acoustic Jam at the Mamburao Campus Gymnasium

All OMSC Mamburao students, alumni, and parents are invited to participate. Admission is free.`,
    authorName: 'Dr. Gregory Tan',
    authorRole: 'Head of Socio-Cultural Affairs, OMSC Mamburao',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    location: 'OMSC Mamburao Campus Gymnasium, Brgy. Tayamaan',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'Mamburao_Festival_Event_Program_2026.pdf', size: '2.8 MB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'CulturalFest', 'Academics', 'Events', 'Tamaraw'],
    isPinned: false,
    viewsCount: 890,
    readByStudentIds: ['user-student-1', 'user-student-2', 'user-student-3'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'ann-7',
    title: 'OMSC Mamburao Campus Health Clinic: Annual Mandatory Health Clearance',
    category: 'Important Reminders',
    priority: 'Important',
    summary: 'All enrolled Mamburao students must undergo physical assessment and dental check-ups at the Campus Clinic.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Campus Health and Wellness Clinic
Brgy. Tayamaan, Mamburao, Occidental Mindoro

Notice to all Mamburao Campus students:
Annual medical clearance is a prerequisite for continued laboratory access, on-the-job training (OJT) endorsements, and academic enrollment.

Clinic Schedule at Mamburao Campus:
• Mondays & Tuesdays: College of Teacher Education (CTE) & Senior High School
• Wednesdays & Thursdays: College of Business, Administration & Management (CBAM)
• Fridays: College of Arts, Sciences & Technology (CAST) and College of Criminal Justice Education (CCJE)

Clinic Hours: 8:00 AM to 4:00 PM daily at Clinic Room 101, Ground Floor Admin Building. Please bring your completed Medical History Form and updated vaccination card.`,
    authorName: 'Dr. Corazon Morales, MD',
    authorRole: 'Campus Medical Officer, OMSC Mamburao Clinic',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'Mamburao_Campus_Student_Health_Form.pdf', size: '580 KB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'Clinic', 'Health', 'MedicalClearance'],
    isPinned: false,
    viewsCount: 450,
    readByStudentIds: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'ann-8',
    title: 'OMSC Mamburao Campus: CHED UniFAST, TES & Municipal Scholarship Validation',
    category: 'Academic',
    priority: 'Important',
    summary: 'Validation of documents for CHED Tertiary Education Subsidy (TES) grantees and Mamburao Municipal Scholars.',
    content: `OCCIDENTAL MINDORO STATE COLLEGE - MAMBURAO CAMPUS
Office of Scholarships and Financial Assistance (OSFA) - Mamburao Unit
Brgy. Tayamaan, Mamburao, Occidental Mindoro

The Mamburao Campus Scholarship Unit announces the document validation schedule for CHED UniFAST Tertiary Education Subsidy (TES) grantees and local municipal scholars from Mamburao, Paluan, and Abra de Ilog.

Submission Requirements:
1. Certified True Copy of Grades (General Weighted Average).
2. Official Certificate of Registration (COR) for the 1st Semester.
3. Valid OMSC Mamburao Student ID and Landbank ATM Card copy.
4. Certificate of Indigency from your respective Barangay in Mamburao / Occidental Mindoro.

Submit documents to the OSFA Window at the Mamburao Campus Admin Building from 8:00 AM to 5:00 PM.`,
    authorName: 'Scholarship Focal Person',
    authorRole: 'Scholarships & Financial Assistance (OSFA), OMSC Mamburao',
    targetAudience: 'All Students',
    campus: 'OMSC Mamburao Campus',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      { name: 'Mamburao_TES_Validation_Form_AY2026.pdf', size: '720 KB', type: 'application/pdf' }
    ],
    tags: ['Mamburao', 'Scholarship', 'UniFAST', 'TES', 'FinancialAid'],
    isPinned: false,
    viewsCount: 750,
    readByStudentIds: ['user-student-1'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  }
];

export interface ClientUser extends User {
  password?: string;
  readAnnouncementIds?: string[];
  bookmarkedAnnouncementIds?: string[];
}

export const SEED_USERS: ClientUser[] = [
  {
    id: 'user-admin-1',
    name: 'Office of the Campus Director',
    email: 'admin@school.edu',
    role: 'admin',
    campus: 'OMSC Mamburao Campus',
    department: 'Office of the Campus Director, OMSC Mamburao',
    isActive: true,
    createdAt: '2026-01-15T08:00:00.000Z',
    password: 'Admin123!',
    bookmarkedAnnouncementIds: [],
    readAnnouncementIds: []
  },
  {
    id: 'user-student-1',
    name: 'Kathleen Ann Santos',
    email: 'student@school.edu',
    role: 'student',
    studentId: '2026-MAMB-08192',
    campus: 'OMSC Mamburao Campus',
    department: 'College of Arts, Sciences, and Technology (CAST)',
    gradeLevel: '3rd Year - BS Information Technology',
    isActive: true,
    createdAt: '2026-02-01T09:30:00.000Z',
    password: 'Student123!',
    bookmarkedAnnouncementIds: ['ann-1', 'ann-2'],
    readAnnouncementIds: ['ann-1', 'ann-2', 'ann-3', 'ann-6', 'ann-8']
  },
  {
    id: 'user-student-2',
    name: 'Angelo Miguel Reyes',
    email: 'angelo.reyes@mamburao.omsc.edu.ph',
    role: 'student',
    studentId: '2026-MAMB-04221',
    campus: 'OMSC Mamburao Campus',
    department: 'College of Teacher Education (CTE)',
    gradeLevel: '2nd Year - Bachelor of Secondary Education',
    isActive: true,
    createdAt: '2026-02-02T10:15:00.000Z',
    password: 'Student123!',
    bookmarkedAnnouncementIds: ['ann-2'],
    readAnnouncementIds: ['ann-1', 'ann-4', 'ann-5']
  },
  {
    id: 'user-student-3',
    name: 'Sophia Nicole Fernandez',
    email: 'sophia.fernandez@mamburao.omsc.edu.ph',
    role: 'student',
    studentId: '2026-MAMB-09105',
    campus: 'OMSC Mamburao Campus',
    department: 'College of Business, Administration, and Management (CBAM)',
    gradeLevel: '1st Year - BS Business Administration',
    isActive: true,
    createdAt: '2026-02-05T11:45:00.000Z',
    password: 'Student123!',
    bookmarkedAnnouncementIds: ['ann-6'],
    readAnnouncementIds: ['ann-3', 'ann-6']
  },
  {
    id: 'user-student-4',
    name: 'Joshua David Ramos',
    email: 'joshua.ramos@mamburao.omsc.edu.ph',
    role: 'student',
    studentId: '2026-MAMB-01188',
    campus: 'OMSC Mamburao Campus',
    department: 'College of Criminal Justice Education (CCJE)',
    gradeLevel: '4th Year - BS Criminology',
    isActive: false,
    createdAt: '2026-02-10T14:20:00.000Z',
    password: 'Student123!',
    bookmarkedAnnouncementIds: [],
    readAnnouncementIds: []
  }
];

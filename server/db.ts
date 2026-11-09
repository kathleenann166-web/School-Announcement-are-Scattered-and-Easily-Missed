import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Announcement,
  UserRecord,
  User,
  NotificationItem,
  AnnouncementStats,
  AnnouncementCategory,
  AnnouncementPriority
} from '../src/types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hub_db.json');

export const OMSC_MAMBURAO_PROGRAMS = [
  'All Programs',
  'College of Teacher Education (CTE)',
  'College of Business, Administration, and Management (CBAM)',
  'College of Arts, Sciences, and Technology (CAST)',
  'College of Criminal Justice Education (CCJE)',
  'Senior High School (SHS)'
];

interface DatabaseSchema {
  users: UserRecord[];
  announcements: Announcement[];
  notifications: Record<string, NotificationItem[]>; // keyed by userId
  logs: Array<{ id: string; action: string; actor: string; timestamp: string; details?: string }>;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial Seed Announcements tailored specifically for OMSC Mamburao Campus
const SEED_ANNOUNCEMENTS: Announcement[] = [
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

// Seed Users exclusively for OMSC Mamburao Campus
const SEED_USERS: UserRecord[] = [
  {
    id: 'user-admin-1',
    name: 'Office of the Campus Director',
    email: 'admin@school.edu',
    role: 'admin',
    campus: 'OMSC Mamburao Campus',
    department: 'Office of the Campus Director, OMSC Mamburao',
    isActive: true,
    createdAt: '2026-01-15T08:00:00.000Z',
    passwordHash: hashPassword('Admin123!'),
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
    passwordHash: hashPassword('Student123!'),
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
    passwordHash: hashPassword('Student123!'),
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
    passwordHash: hashPassword('Student123!'),
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
    passwordHash: hashPassword('Student123!'),
    bookmarkedAnnouncementIds: [],
    readAnnouncementIds: []
  }
];

class DatabaseStore {
  private db: DatabaseSchema = {
    users: [],
    announcements: [],
    notifications: {},
    logs: []
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
        if (!this.db.users || this.db.users.length === 0) this.db.users = SEED_USERS;
        if (!this.db.announcements || this.db.announcements.length === 0) this.db.announcements = SEED_ANNOUNCEMENTS;
        if (!this.db.notifications) this.db.notifications = {};
        if (!this.db.logs) this.db.logs = [];
      } else {
        this.db = {
          users: SEED_USERS,
          announcements: SEED_ANNOUNCEMENTS,
          notifications: {
            'user-student-1': [
              {
                id: 'notif-1',
                announcementId: 'ann-1',
                title: 'OMSC MAMBURAO EMERGENCY: Storm Weather Class Suspension',
                message: 'All classes at OMSC Mamburao Campus in Brgy. Tayamaan are suspended immediately.',
                priority: 'Emergency',
                category: 'Emergency Announcements',
                isRead: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
              },
              {
                id: 'notif-2',
                announcementId: 'ann-2',
                title: 'OMSC Mamburao Midterm Schedules Posted',
                message: 'Room assignments for CTE, CBAM, CAST, and CCJE released at the Tayamaan campus.',
                priority: 'Important',
                category: 'Examination Schedules',
                isRead: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
              }
            ]
          },
          logs: [
            {
              id: 'log-1',
              action: 'MAMBURAO_SYSTEM_INIT',
              actor: 'Campus Admin',
              timestamp: new Date().toISOString(),
              details: 'Occidental Mindoro State College - Mamburao Campus announcement management system initialized.'
            }
          ]
        };
        this.save();
      }
    } catch (err) {
      console.error('Database init error:', err);
      this.db = {
        users: SEED_USERS,
        announcements: SEED_ANNOUNCEMENTS,
        notifications: {},
        logs: []
      };
    }
  }

  private save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  public getUsers(): User[] {
    return this.db.users.map(({ passwordHash, bookmarkedAnnouncementIds, readAnnouncementIds, ...safeUser }) => safeUser);
  }

  public getUserById(id: string): User | null {
    const user = this.db.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safe } = user;
    return safe;
  }

  public getUserByEmail(email: string): UserRecord | null {
    const clean = email.toLowerCase().trim();
    return this.db.users.find(u => {
      const userEmail = u.email.toLowerCase();
      if (userEmail === clean) return true;
      if (clean === 'student@mamburao.omsc.edu.ph' && userEmail === 'student@school.edu') return true;
      if (clean === 'admin@mamburao.omsc.edu.ph' && userEmail === 'admin@school.edu') return true;
      return false;
    }) || null;
  }

  public registerUser(params: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
    campus?: string;
    studentId?: string;
    gradeLevel?: string;
    department?: string;
  }): { user: User; error?: string } {
    const email = params.email.toLowerCase().trim();
    if (this.getUserByEmail(email)) {
      return { user: null as any, error: 'An account with this email already exists in OMSC Mamburao records.' };
    }

    const newUser: UserRecord = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name: params.name.trim(),
      email,
      role: params.role,
      campus: 'OMSC Mamburao Campus',
      studentId: params.studentId?.trim() || `2026-MAMB-${Math.floor(10000 + Math.random() * 90000)}`,
      gradeLevel: params.gradeLevel?.trim() || 'Collegiate Undergraduate',
      department: params.department?.trim() || (params.role === 'admin' ? 'Office of the Campus Director' : 'College of Teacher Education (CTE)'),
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(params.password),
      bookmarkedAnnouncementIds: [],
      readAnnouncementIds: []
    };

    this.db.users.push(newUser);
    this.addLog('REGISTER_MAMBURAO_USER', newUser.email, `OMSC Mamburao user registered as ${newUser.role}: ${newUser.name}`);
    this.save();

    const { passwordHash, ...safe } = newUser;
    return { user: safe };
  }

  public loginUser(email: string, password: string): { user: User; token: string } | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    if (user.passwordHash !== hashPassword(password)) {
      return null;
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact the OMSC Mamburao Campus Director Office.');
    }

    const { passwordHash, ...safe } = user;
    const token = `token-${user.id}-${Date.now()}`;
    return { user: safe, token };
  }

  public resetUserPassword(email: string, newPassword?: string): { success: boolean; tempPassword?: string; message: string } {
    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'No registered OMSC Mamburao account found with that email address.' };
    }

    const tempPassword = newPassword || `Mamburao${Math.floor(1000 + Math.random() * 9000)}!`;
    user.passwordHash = hashPassword(tempPassword);
    this.addLog('MAMBURAO_PASSWORD_RESET', user.email, `Password reset generated for ${user.email}`);
    this.save();

    return {
      success: true,
      tempPassword,
      message: `Password reset successfully! Your temporary password is: ${tempPassword}. You can now log in to the Mamburao portal.`
    };
  }

  public toggleUserStatus(userId: string): User | null {
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return null;
    user.isActive = !user.isActive;
    this.addLog('USER_STATUS_CHANGE', 'admin', `Toggled active status of ${user.email} to ${user.isActive}`);
    this.save();
    const { passwordHash, ...safe } = user;
    return safe;
  }

  public getAnnouncements(query?: {
    search?: string;
    category?: string;
    priority?: string;
    targetAudience?: string;
    department?: string;
    status?: string;
    userId?: string;
  }): { announcements: Announcement[]; userReads: string[]; userBookmarks: string[] } {
    let list = [...this.db.announcements];

    if (query?.status) {
      list = list.filter(a => a.status === query.status);
    } else {
      list = list.filter(a => a.status === 'published' || a.status === 'scheduled');
    }

    if (query?.category && query.category !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query?.priority && query.priority !== 'All') {
      list = list.filter(a => a.priority.toLowerCase() === query.priority!.toLowerCase());
    }

    if (query?.targetAudience && query.targetAudience !== 'All') {
      list = list.filter(a => a.targetAudience === query.targetAudience || a.targetAudience === 'All Students');
    }

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.priority === 'Emergency' && b.priority !== 'Emergency') return -1;
      if (a.priority !== 'Emergency' && b.priority === 'Emergency') return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    let userReads: string[] = [];
    let userBookmarks: string[] = [];

    if (query?.userId) {
      const user = this.db.users.find(u => u.id === query.userId);
      if (user) {
        userReads = user.readAnnouncementIds || [];
        userBookmarks = user.bookmarkedAnnouncementIds || [];
      }
    }

    return { announcements: list, userReads, userBookmarks };
  }

  public getAnnouncementById(id: string, incrementView = false): Announcement | null {
    const ann = this.db.announcements.find(a => a.id === id);
    if (!ann) return null;
    if (incrementView) {
      ann.viewsCount = (ann.viewsCount || 0) + 1;
      this.save();
    }
    return ann;
  }

  public createAnnouncement(data: Partial<Announcement>, authorUser: User): Announcement {
    const now = new Date().toISOString();
    const newAnn: Announcement = {
      id: `ann-${crypto.randomUUID().slice(0, 8)}`,
      title: data.title || 'Untitled Mamburao Announcement',
      category: (data.category as AnnouncementCategory) || 'Academic',
      priority: (data.priority as AnnouncementPriority) || 'Normal',
      summary: data.summary || '',
      content: data.content || '',
      authorName: data.authorName || authorUser.name,
      authorRole: data.authorRole || authorUser.department || 'Office of the Campus Director, OMSC Mamburao',
      targetAudience: data.targetAudience || 'All Students',
      campus: 'OMSC Mamburao Campus',
      publishDate: data.scheduledFor ? data.scheduledFor : now,
      scheduledFor: data.scheduledFor,
      status: data.scheduledFor && new Date(data.scheduledFor) > new Date() ? 'scheduled' : 'published',
      eventDate: data.eventDate,
      deadlineDate: data.deadlineDate,
      location: data.location || 'OMSC Mamburao Campus, Brgy. Tayamaan',
      imageUrl: data.imageUrl,
      attachments: data.attachments || [],
      tags: data.tags || ['OMSC', 'Mamburao'],
      isPinned: Boolean(data.isPinned),
      viewsCount: 0,
      readByStudentIds: [],
      createdAt: now,
      updatedAt: now
    };

    this.db.announcements.unshift(newAnn);

    this.broadcastNotification({
      announcementId: newAnn.id,
      title: newAnn.title,
      message: newAnn.summary || `New ${newAnn.category} bulletin published for OMSC Mamburao Campus.`,
      priority: newAnn.priority,
      category: newAnn.category
    });

    this.addLog('CREATE_MAMBURAO_ANNOUNCEMENT', authorUser.email, `Created announcement: ${newAnn.title} (${newAnn.priority})`);
    this.save();
    return newAnn;
  }

  public updateAnnouncement(id: string, updates: Partial<Announcement>, adminUser: User): Announcement | null {
    const idx = this.db.announcements.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const existing = this.db.announcements[idx];
    const updated: Announcement = {
      ...existing,
      ...updates,
      campus: 'OMSC Mamburao Campus',
      updatedAt: new Date().toISOString()
    };

    this.db.announcements[idx] = updated;
    this.addLog('UPDATE_MAMBURAO_ANNOUNCEMENT', adminUser.email, `Updated announcement: ${updated.title}`);
    this.save();
    return updated;
  }

  public deleteAnnouncement(id: string, adminUser: User): boolean {
    const idx = this.db.announcements.findIndex(a => a.id === id);
    if (idx === -1) return false;

    const deleted = this.db.announcements.splice(idx, 1)[0];
    this.addLog('DELETE_MAMBURAO_ANNOUNCEMENT', adminUser.email, `Deleted announcement: ${deleted.title}`);
    this.save();
    return true;
  }

  public toggleReadAnnouncement(announcementId: string, userId: string, markRead?: boolean): { isRead: boolean } {
    const user = this.db.users.find(u => u.id === userId);
    const ann = this.db.announcements.find(a => a.id === announcementId);
    if (!user || !ann) return { isRead: false };

    if (!user.readAnnouncementIds) user.readAnnouncementIds = [];
    if (!ann.readByStudentIds) ann.readByStudentIds = [];

    const currentlyRead = user.readAnnouncementIds.includes(announcementId);
    const shouldBeRead = markRead !== undefined ? markRead : !currentlyRead;

    if (shouldBeRead) {
      if (!user.readAnnouncementIds.includes(announcementId)) {
        user.readAnnouncementIds.push(announcementId);
      }
      if (!ann.readByStudentIds.includes(userId)) {
        ann.readByStudentIds.push(userId);
      }
    } else {
      user.readAnnouncementIds = user.readAnnouncementIds.filter(id => id !== announcementId);
      ann.readByStudentIds = ann.readByStudentIds.filter(id => id !== userId);
    }

    this.save();
    return { isRead: shouldBeRead };
  }

  public toggleBookmarkAnnouncement(announcementId: string, userId: string): { isBookmarked: boolean } {
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return { isBookmarked: false };

    if (!user.bookmarkedAnnouncementIds) user.bookmarkedAnnouncementIds = [];

    const isBookmarked = user.bookmarkedAnnouncementIds.includes(announcementId);
    if (isBookmarked) {
      user.bookmarkedAnnouncementIds = user.bookmarkedAnnouncementIds.filter(id => id !== announcementId);
    } else {
      user.bookmarkedAnnouncementIds.push(announcementId);
    }

    this.save();
    return { isBookmarked: !isBookmarked };
  }

  private broadcastNotification(notif: {
    announcementId: string;
    title: string;
    message: string;
    priority: AnnouncementPriority;
    category: AnnouncementCategory;
  }) {
    const students = this.db.users.filter(u => u.role === 'student');
    students.forEach(student => {
      if (!this.db.notifications[student.id]) {
        this.db.notifications[student.id] = [];
      }
      this.db.notifications[student.id].unshift({
        id: `notif-${crypto.randomUUID().slice(0, 8)}`,
        announcementId: notif.announcementId,
        title: notif.title,
        message: notif.message,
        priority: notif.priority,
        category: notif.category,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      if (this.db.notifications[student.id].length > 30) {
        this.db.notifications[student.id].pop();
      }
    });
  }

  public getNotifications(userId: string): NotificationItem[] {
    return this.db.notifications[userId] || [];
  }

  public markNotificationsAsRead(userId: string): boolean {
    const list = this.db.notifications[userId];
    if (list) {
      list.forEach(n => { n.isRead = true; });
      this.save();
      return true;
    }
    return false;
  }

  public getStats(): AnnouncementStats {
    const totalAnnouncements = this.db.announcements.length;
    const publishedCount = this.db.announcements.filter(a => a.status === 'published').length;
    const scheduledCount = this.db.announcements.filter(a => a.status === 'scheduled').length;
    const emergencyCount = this.db.announcements.filter(a => a.priority === 'Emergency').length;
    const urgentCount = this.db.announcements.filter(a => a.priority === 'Urgent').length;

    const students = this.db.users.filter(u => u.role === 'student');
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.isActive).length;

    const totalReads = this.db.announcements.reduce((acc, curr) => acc + (curr.readByStudentIds?.length || 0), 0);

    const categories: AnnouncementCategory[] = [
      'Academic',
      'School Activities',
      'Events',
      'Examination Schedules',
      'Enrollment',
      'Student Affairs',
      'Important Reminders',
      'Emergency Announcements'
    ];

    const categoryBreakdown = categories.map(cat => ({
      category: cat,
      count: this.db.announcements.filter(a => a.category === cat).length
    }));

    const audiences = ['All Students', 'Senior High School', 'Junior High School', 'College Department'];
    const audienceBreakdown = audiences.map(aud => ({
      audience: aud,
      count: this.db.announcements.filter(a => a.targetAudience === aud).length
    }));

    const mostViewedAnnouncements = [...this.db.announcements]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        title: a.title,
        views: a.viewsCount || 0,
        reads: a.readByStudentIds?.length || 0
      }));

    const averageReadRate = totalStudents > 0 && publishedCount > 0
      ? Math.round((totalReads / (totalStudents * publishedCount)) * 100)
      : 0;

    return {
      totalAnnouncements,
      publishedCount,
      scheduledCount,
      emergencyCount,
      urgentCount,
      totalStudents,
      activeStudents,
      totalReads,
      averageReadRate,
      categoryBreakdown,
      audienceBreakdown,
      mostViewedAnnouncements
    };
  }

  public getLogs() {
    return this.db.logs.slice(-30).reverse();
  }

  private addLog(action: string, actor: string, details?: string) {
    this.db.logs.push({
      id: `log-${crypto.randomUUID().slice(0, 8)}`,
      action,
      actor,
      timestamp: new Date().toISOString(),
      details
    });
  }
}

export const dbStore = new DatabaseStore();

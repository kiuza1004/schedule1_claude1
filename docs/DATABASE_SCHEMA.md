# 데이터베이스 스키마 - Schedule Manager

**작성일**: 2026-04-18  
**데이터베이스**: SQLite3  
**ORM**: Prisma

---

## 📊 데이터베이스 다이어그램

```
┌─────────────────────────────────────┐
│           schedules                  │
├─────────────────────────────────────┤
│ • id (UUID) - PK                    │
│ • title (String, 100)               │
│ • description (String, 1000)        │
│ • prompt (String, 5000)             │
│ • startDate (DateTime)              │
│ • status (Enum)                     │
│ • priority (Enum)                   │
│ • tags (String[])                   │
│ • createdAt (DateTime)              │
│ • updatedAt (DateTime)              │
└─────────────────────────────────────┘
```

---

## 🗂️ Prisma Schema 정의

### schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============================================
// Enums
// ============================================

/// 일정 상태
enum ScheduleStatus {
  plan         // 계획 중
  in_progress  // 진행 중
  completed    // 완료
}

/// 우선순위
enum Priority {
  low          // 낮음
  medium       // 중간
  high         // 높음
}

// ============================================
// Models
// ============================================

/// Schedule 항목
model Schedule {
  /// 고유 식별자 (UUID)
  id        String   @id @default(cuid())
  
  /// 개발 타이틀
  /// @min 1
  /// @max 100
  title     String   @db.VarChar(100)
  
  /// 개발 내용 설명
  /// @min 1
  /// @max 1000
  description String  @db.VarChar(1000)
  
  /// AI 프롬프트
  /// @min 1
  /// @max 5000
  prompt    String   @db.Text
  
  /// 개발 시기
  startDate DateTime
  
  /// 진행 상태
  status    ScheduleStatus @default(plan)
  
  /// 우선순위
  priority  Priority   @default(medium)
  
  /// 태그 목록 (JSON)
  tags      String?  @db.Text // JSON 형식으로 저장: ["tag1", "tag2"]
  
  /// 생성 일시
  createdAt DateTime @default(now())
  
  /// 수정 일시
  updatedAt DateTime @updatedAt

  // ============================================
  // 인덱스
  // ============================================
  
  /// 날짜별 조회 성능 향상
  @@index([startDate])
  
  /// 상태별 필터링 성능 향상
  @@index([status])
  
  /// 우선순위별 정렬 성능 향상
  @@index([priority])
  
  /// 복합 인덱스 (일자 + 상태)
  @@index([startDate, status])
  
  /// 전체 검색을 위한 인덱스
  @@fulltext([title, description, prompt])
}
```

---

## 📋 테이블 상세 정보

### Schedule 테이블

#### 컬럼 정의

| 컬럼명 | 타입 | 제약사항 | 설명 |
|--------|------|---------|------|
| **id** | TEXT | PRIMARY KEY, NOT NULL | UUID 형식의 고유 식별자 |
| **title** | VARCHAR(100) | NOT NULL | 개발 항목 제목 (1-100자) |
| **description** | VARCHAR(1000) | NOT NULL | 상세 설명 (1-1000자) |
| **prompt** | TEXT | NOT NULL | AI 프롬프트 (최대 5000자) |
| **startDate** | DATETIME | NOT NULL | 개발 예정 날짜 |
| **status** | VARCHAR(20) | NOT NULL, DEFAULT 'plan' | 진행 상태 (plan, in_progress, completed) |
| **priority** | VARCHAR(20) | NOT NULL, DEFAULT 'medium' | 우선순위 (low, medium, high) |
| **tags** | TEXT | NULLABLE | 태그 (JSON 배열) |
| **createdAt** | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 생성 일시 |
| **updatedAt** | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 수정 일시 |

#### 인덱스

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_schedules_startDate ON schedules(startDate);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_priority ON schedules(priority);

-- 복합 인덱스
CREATE INDEX idx_schedules_date_status ON schedules(startDate, status);

-- 전문 검색 인덱스 (선택사항, SQLite FTS)
CREATE VIRTUAL TABLE schedules_fts USING fts5(title, description, prompt);
```

---

## 🔄 Enum 값 정의

### ScheduleStatus (진행 상태)

```
plan          // 계획 중: 아직 시작하지 않음
in_progress   // 진행 중: 현재 진행 중
completed     // 완료: 완료됨
```

### Priority (우선순위)

```
low           // 낮음: 나중에 해도 됨
medium        // 중간: 보통 중요도
high          // 높음: 우선적으로 처리
```

---

## 💾 데이터 저장 예제

### 저장되는 데이터 샘플

```javascript
// 예제 1: 계획 상태의 일정
{
  id: "ckzxyz1234567890",
  title: "사용자 인증 시스템 개발",
  description: "JWT 기반 인증 시스템을 구현합니다.",
  prompt: "React와 Express.js를 사용하여 JWT 기반의 사용자 인증 시스템을 구현하세요...",
  startDate: "2026-04-20T00:00:00Z",
  status: "plan",
  priority: "high",
  tags: '["auth", "security", "backend"]',
  createdAt: "2026-04-18T12:00:00Z",
  updatedAt: "2026-04-18T12:00:00Z"
}

// 예제 2: 진행 중인 일정
{
  id: "ckzxyz1234567891",
  title: "UI 반응형 디자인 개선",
  description: "Tailwind CSS를 사용하여 모든 페이지를 반응형으로 만들기",
  prompt: "Tailwind CSS를 사용하여 다음 페이지들을 모바일, 태블릿, 데스크톱에서...",
  startDate: "2026-04-18T00:00:00Z",
  status: "in_progress",
  priority: "medium",
  tags: '["frontend", "css", "responsive"]',
  createdAt: "2026-04-17T10:30:00Z",
  updatedAt: "2026-04-18T14:00:00Z"
}

// 예제 3: 완료된 일정
{
  id: "ckzxyz1234567892",
  title: "프로젝트 초기 설정",
  description: "프로젝트 기본 구조 및 설정 완료",
  prompt: "React와 Express를 사용하여 프로젝트 초기 설정을 수행하세요...",
  startDate: "2026-04-15T00:00:00Z",
  status: "completed",
  priority: "high",
  tags: '["setup", "configuration"]',
  createdAt: "2026-04-14T09:00:00Z",
  updatedAt: "2026-04-17T17:30:00Z"
}
```

---

## 🔍 일반적인 SQL 쿼리

### 쿼리 1: 모든 일정 조회 (최신순)

```sql
SELECT * FROM schedules 
ORDER BY startDate DESC, createdAt DESC
LIMIT 10 OFFSET 0;
```

### 쿼리 2: 특정 날짜의 일정 조회

```sql
SELECT * FROM schedules
WHERE DATE(startDate) = '2026-04-18'
ORDER BY priority DESC, createdAt DESC;
```

### 쿼리 3: 진행 중인 고우선순위 일정

```sql
SELECT * FROM schedules
WHERE status = 'in_progress' AND priority = 'high'
ORDER BY startDate ASC;
```

### 쿼리 4: 키워드로 검색

```sql
SELECT * FROM schedules
WHERE title LIKE '%키워드%' 
   OR description LIKE '%키워드%'
   OR prompt LIKE '%키워드%'
ORDER BY startDate DESC;
```

### 쿼리 5: 상태별 통계

```sql
SELECT 
  status,
  COUNT(*) as count
FROM schedules
GROUP BY status;
```

### 쿼리 6: 우선순위별 통계

```sql
SELECT 
  priority,
  COUNT(*) as count
FROM schedules
GROUP BY priority;
```

### 쿼리 7: 월별 일정 수

```sql
SELECT 
  DATE_TRUNC('month', startDate) as month,
  COUNT(*) as count
FROM schedules
GROUP BY month
ORDER BY month DESC;
```

### 쿼리 8: 완료된 일정의 평균 소요 기간

```sql
SELECT 
  AVG(julianday(updatedAt) - julianday(createdAt)) as avg_days
FROM schedules
WHERE status = 'completed';
```

---

## 🔐 데이터 무결성

### 제약 조건

1. **Primary Key**: id (자동으로 생성됨)
2. **NOT NULL**: title, description, prompt, startDate
3. **Unique**: 없음 (같은 제목으로 다른 날짜에 여러 항목 가능)
4. **Check Constraints**: 
   - status는 (plan, in_progress, completed) 중 하나
   - priority는 (low, medium, high) 중 하나

### 트리거 (선택사항)

```sql
-- updatedAt 자동 업데이트 트리거
CREATE TRIGGER update_schedule_timestamp
AFTER UPDATE ON schedules
FOR EACH ROW
BEGIN
  UPDATE schedules SET updatedAt = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;
```

---

## 📈 성능 최적화

### 인덱스 전략

1. **조회 성능**: startDate, status, priority 인덱스
2. **검색 성능**: 전문 검색 인덱스 (FTS)
3. **필터링 성능**: 복합 인덱스 (startDate, status)

### 쿼리 최적화 팁

```javascript
// ❌ 비효율적
const items = schedules.filter(s => {
  return s.startDate === date && s.status === 'in_progress';
});

// ✅ 효율적 (DB 쿼리)
const items = await db.schedule.findMany({
  where: {
    startDate: { gte: new Date(date) },
    status: 'in_progress'
  }
});
```

---

## 🔄 마이그레이션

### Prisma 마이그레이션 명령어

```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션에 적용
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (개발용)
npx prisma migrate reset
```

### 마이그레이션 파일 예제

```sql
-- prisma/migrations/001_init_schedule/migration.sql

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('plan', 'in_progress', 'completed');
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "prompt" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'plan',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "schedules_startDate_idx" ON "schedules"("startDate");
CREATE INDEX "schedules_status_idx" ON "schedules"("status");
CREATE INDEX "schedules_priority_idx" ON "schedules"("priority");
CREATE INDEX "schedules_startDate_status_idx" ON "schedules"("startDate", "status");
```

---

## 🛠️ 백업 및 복구

### SQLite 백업

```bash
# 전체 데이터베이스 백업
sqlite3 schedule.db ".dump" > backup.sql

# 특정 테이블 백업
sqlite3 schedule.db ".dump schedules" > schedules_backup.sql
```

### 데이터 복구

```bash
# 백업에서 복구
sqlite3 schedule.db < backup.sql
```

---

## 📝 데이터 초기화

### 초기 샘플 데이터

```javascript
const sampleSchedules = [
  {
    title: "프로젝트 초기 설정",
    description: "React + Express + SQLite 프로젝트 초기화",
    prompt: "프로젝트 폴더 구조와 기본 설정을 완료하세요",
    startDate: new Date('2026-04-15'),
    status: 'completed',
    priority: 'high',
    tags: ['setup', 'config']
  },
  {
    title: "데이터베이스 스키마 설계",
    description: "Prisma를 사용한 Schedule 모델 설계",
    prompt: "Schedule 테이블의 스키마를 Prisma로 정의하세요",
    startDate: new Date('2026-04-16'),
    status: 'completed',
    priority: 'high',
    tags: ['database', 'schema']
  },
  {
    title: "Backend API 개발",
    description: "Express.js REST API 구현",
    prompt: "CRUD 엔드포인트를 구현하세요",
    startDate: new Date('2026-04-18'),
    status: 'in_progress',
    priority: 'high',
    tags: ['backend', 'api']
  }
];
```

---

**작성일**: 2026-04-18  
**버전**: 1.0.0  
**마지막 수정**: 2026-04-18


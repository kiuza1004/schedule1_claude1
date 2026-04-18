# 🚀 Schedule Manager 개발 상세 프롬프트

이 문서는 Claude AI를 활용한 개발 시 사용할 **상세하고 정확한 프롬프트**를 제공합니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기본 설정](#기본-설정)
3. [기능별 개발 프롬프트](#기능별-개발-프롬프트)
4. [테스트 프롬프트](#테스트-프롬프트)
5. [배포 및 최적화](#배포-및-최적화)

---

## 🎯 프로젝트 개요

### 프로젝트명
**Schedule Manager** - 개발 일정 및 프롬프트 관리 웹 애플리케이션

### 기술 스택
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Database**: SQLite3 with Prisma ORM
- **Deployment**: GitHub Pages / Vercel

### 핵심 기능
1. 달력 기반 일정 관리
2. 개발 항목 CRUD
3. 일자별/키워드별 검색
4. 상태 및 우선순위 관리
5. 수정/삭제 확인 팝업

---

## 🔧 기본 설정

### 프롬프트 1: 프로젝트 초기화

```
당신은 React + Node.js + SQLite 풀스택 웹 개발자입니다.

다음 요구사항에 따라 Schedule Manager 프로젝트를 초기화하세요:

1. 프로젝트 구조:
   - frontend/ (React 애플리케이션)
   - backend/ (Express 서버)
   - docs/ (문서)
   - config/ (설정 파일)

2. package.json 설정:
   - Frontend dependencies: react, react-dom, typescript, tailwind, react-query, zustand, react-hook-form
   - Backend dependencies: express, prisma, sqlite3, cors, joi

3. TypeScript 설정:
   - tsconfig.json 생성
   - 엄격한 타입 체크 활성화
   - 소스맵 활성화

4. 환경 설정:
   - .env.example 파일 생성
   - DATABASE_URL, NODE_ENV, PORT 등 포함

5. 기본 폴더 구조 생성:
   - src/components/
   - src/pages/
   - src/services/
   - src/store/
   - src/types/

중요: 모든 코드는 TypeScript로 작성하고, 완전한 타입 안정성을 보장하세요.
```

### 프롬프트 2: 데이터베이스 스키마 정의

```
Prisma ORM을 사용하여 Schedule Manager의 데이터베이스 스키마를 설계하세요.

요구사항:
1. Schedule 모델:
   - id: UUID (주키)
   - title: String (최대 100자, 필수)
   - description: String (최대 1000자)
   - prompt: String (최대 5000자, 필수)
   - startDate: DateTime (필수)
   - status: Enum (plan, in-progress, completed, 기본값: plan)
   - priority: Enum (low, medium, high, 기본값: medium)
   - tags: String[] (선택)
   - createdAt: DateTime (자동 생성)
   - updatedAt: DateTime (자동 업데이트)

2. 인덱스:
   - startDate에 복합 인덱스 (정렬 성능)
   - status에 인덱스 (필터링)
   - title에 텍스트 검색 인덱스

3. 제약 조건:
   - title 필수, 100자 제한
   - prompt 필수, 5000자 제한
   - startDate 필수

4. 마이그레이션 파일 생성

마이그레이션 파일명: prisma/migrations/001_init_schedule

요구사항을 만족하는 complete한 schema.prisma 파일을 생성하세요.
```

---

## 🎨 기능별 개발 프롬프트

### 프롬프트 3: 달력 컴포넌트 개발

```
React Calendar를 활용하여 Schedule Manager의 달력 컴포넌트를 개발하세요.

요구사항:
1. 컴포넌트명: Calendar.tsx
   - 위치: src/frontend/components/Calendar/

2. 기능:
   - 월간 달력 표시
   - 현재 날짜 하이라이트
   - 개발 항목이 있는 날짜에 배지 표시 (개수)
   - 날짜 클릭 시 onDateSelect 콜백 호출
   - 이전/다음 월 이동 버튼

3. 디자인:
   - Tailwind CSS 사용
   - 반응형 (모바일/태블릿/데스크톱)
   - 색상: primary-500, gray-100, green-500
   - 호버 효과 및 전환 애니메이션

4. Props:
   - events: Map<string, number> (날짜별 항목 수)
   - onDateSelect: (date: Date) => void
   - selectedDate?: Date

5. 상태:
   - currentMonth: Date
   - selectedDate: Date

6. 기능:
   - 날짜 포맷: YYYY-MM-DD
   - 요일 표시: 일, 월, 화, 수, 목, 금, 토
   - 달 이름과 연도 표시

TypeScript 타입을 완벽하게 정의하고, 재사용 가능한 구조로 작성하세요.
```

### 프롬프트 4: 일정 등록 폼 개발

```
React Hook Form을 사용하여 Schedule Manager의 일정 등록 폼을 개발하세요.

요구사항:
1. 컴포넌트명: ScheduleForm.tsx
   - 위치: src/frontend/components/ScheduleForm/

2. 입력 필드:
   a) 타이틀 (title)
      - 타입: Text Input
      - 최대 길이: 100자
      - 필수
      - 실시간 문자 수 표시
   
   b) 개발 내용 (description)
      - 타입: Textarea
      - 최대 길이: 1000자
      - 필수
      - 실시간 문자 수 표시
   
   c) 프롬프트 (prompt)
      - 타입: Textarea
      - 최대 길이: 5000자
      - 필수
      - 실시간 문자 수 표시
      - 카피 버튼
   
   d) 개발 시기 (startDate)
      - 타입: Date Picker
      - 필수
      - 기본값: 오늘 날짜
   
   e) 상태 (status)
      - 타입: Radio/Select
      - 옵션: 계획, 진행중, 완료
      - 기본값: 계획
      - 필수
   
   f) 우선순위 (priority)
      - 타입: Select
      - 옵션: 낮음, 중간, 높음
      - 기본값: 중간
      - 선택사항

3. 검증 규칙:
   - 모든 필수 필드 입력 확인
   - 타이틀 100자 제한
   - 설명 1000자 제한
   - 프롬프트 5000자 제한
   - 날짜는 과거 1년 ~ 미래 1년 범위

4. 디자인:
   - Tailwind CSS
   - 반응형
   - 필드별 에러 메시지 표시
   - 제출 전 검증 요약 표시

5. Props:
   - initialData?: Schedule (수정 시)
   - onSubmit: (data: ScheduleFormData) => Promise<void>
   - isLoading?: boolean

6. 기능:
   - 폼 제출 시 로딩 상태 표시
   - 성공/실패 알림
   - 폼 초기화 버튼
   - 취소 버튼

완벽한 타입 정의와 함께 사용자 친화적인 폼을 작성하세요.
```

### 프롬프트 5: 검색 기능 개발

```
Schedule Manager의 검색 기능을 구현하세요.

요구사항:
1. 검색 타입:
   a) 일자별 검색
      - 시작 날짜 입력
      - 종료 날짜 입력 (선택)
      - 해당 범위의 모든 항목 반환
   
   b) 키워드 검색
      - 타이틀, 설명, 프롬프트에서 검색
      - 대소문자 구분 안함
      - 부분 검색 지원
      - 여러 키워드 AND 검색 지원

2. 필터링:
   - 상태별: plan, in-progress, completed
   - 우선순위별: low, medium, high
   - 여러 필터 조합 가능

3. 정렬:
   - 날짜순 (최신순/오래된순)
   - 우선순위순
   - 생성순

4. API 엔드포인트:
   - GET /api/schedules/search?q=keyword&status=plan&priority=high
   - GET /api/schedules/date?startDate=2026-04-01&endDate=2026-04-30
   - GET /api/schedules?sort=date&order=desc

5. Frontend 컴포넌트:
   - SearchBar.tsx (검색 입력)
   - FilterPanel.tsx (필터 UI)
   - SearchResults.tsx (결과 표시)

6. 성능:
   - 디바운싱 (300ms) 적용
   - 페이지네이션 (10개 per page)
   - 검색 결과 캐싱

7. UX:
   - 검색 결과 수 표시
   - 키워드 하이라이트
   - 필터 리셋 버튼
   - 검색 이력 (선택)

완벽한 검색 경험을 제공하세요.
```

### 프롬프트 6: 수정/삭제 모달 개발

```
Schedule Manager의 수정/삭제 확인 모달을 개발하세요.

요구사항:
1. 컴포넌트명: ConfirmModal.tsx
   - 위치: src/frontend/components/Modal/

2. 모달 타입:
   a) 삭제 확인 모달
      - 제목: "정말로 삭제하시겠습니까?"
      - 메시지: "이 작업은 되돌릴 수 없습니다."
      - 삭제할 항목 타이틀 표시
      - 확인 버튼 (1초 후 활성화 - 실수 방지)
      - 취소 버튼
   
   b) 수정 확인 모달
      - 제목: "정말로 수정하시겠습니까?"
      - 변경 전/후 비교 표시
      - 변경된 필드만 하이라이트
      - 확인 버튼
      - 취소 버튼

3. 디자인:
   - Tailwind CSS
   - 어두운 오버레이 (opacity-50)
   - 중앙 정렬
   - 부드러운 애니메이션
   - 반응형

4. Props:
   - type: 'delete' | 'update'
   - title: string
   - message: string
   - data?: ScheduleData (수정 시 변경 사항)
   - onConfirm: () => Promise<void>
   - onCancel: () => void
   - isLoading?: boolean

5. 기능:
   - Escape 키 누르면 닫기
   - 배경 클릭해도 닫기 (선택)
   - 로딩 상태 표시
   - 성공/실패 메시지

6. 접근성:
   - ARIA 레이블
   - 포커스 트래핑
   - 키보드 네비게이션

완벽한 사용자 경험을 제공하세요.
```

### 프롬프트 7: Backend API 개발

```
Express.js를 사용하여 Schedule Manager의 REST API를 개발하세요.

요구사항:
1. 엔드포인트:
   
   a) 생성 (POST /api/schedules)
      - 요청: ScheduleCreateInput
      - 응답: { success: true, data: Schedule }
      - 에러: 400, 422, 500
      - 입력 검증: Joi 사용
   
   b) 조회 전체 (GET /api/schedules)
      - 쿼리: page=1&limit=10&sort=date&order=desc
      - 응답: { success: true, data: Schedule[], total: number, page: number }
   
   c) 조회 상세 (GET /api/schedules/:id)
      - 응답: { success: true, data: Schedule }
      - 에러: 404 (항목 없음)
   
   d) 검색 (GET /api/schedules/search)
      - 쿼리: q=keyword&status=plan&priority=high
      - 응답: { success: true, data: Schedule[], count: number }
   
   e) 날짜별 조회 (GET /api/schedules/date/:date)
      - 응답: { success: true, data: Schedule[] }
   
   f) 수정 (PUT /api/schedules/:id)
      - 요청: ScheduleUpdateInput
      - 응답: { success: true, data: Schedule }
      - 에러: 404, 422
   
   g) 삭제 (DELETE /api/schedules/:id)
      - 응답: { success: true, message: '삭제되었습니다' }
      - 에러: 404
   
   h) 통계 (GET /api/schedules/stats)
      - 응답: { success: true, data: { total, byStatus, byPriority } }

2. 에러 처리:
   - 통일된 에러 응답 형식
   - 적절한 HTTP 상태 코드
   - 상세한 에러 메시지

3. 입력 검증:
   - Joi 스키마 정의
   - 필수 필드 검사
   - 길이 제한 검사
   - 날짜 범위 검사

4. 미들웨어:
   - CORS 설정
   - 로깅
   - 에러 핸들러
   - 라우트 핸들러

5. 데이터베이스:
   - Prisma 클라이언트 사용
   - 트랜잭션 처리 (필요시)
   - 성능 최적화 (인덱스 활용)

완벽하게 작동하는 API를 제공하세요.
```

### 프롬프트 8: 상태 관리 (Zustand) 개발

```
Zustand를 사용하여 Schedule Manager의 전역 상태 관리를 구현하세요.

요구사항:
1. Store 이름: scheduleStore
   - 위치: src/frontend/store/scheduleStore.ts

2. 상태:
   - schedules: Schedule[]
   - selectedDate: Date | null
   - searchQuery: string
   - filters: {
       status: string[],
       priority: string[],
       dateRange: { start: Date, end: Date } | null
     }
   - isLoading: boolean
   - error: string | null

3. 액션:
   - setSchedules(schedules: Schedule[])
   - addSchedule(schedule: Schedule)
   - updateSchedule(id: string, data: Partial<Schedule>)
   - deleteSchedule(id: string)
   - setSelectedDate(date: Date)
   - setSearchQuery(query: string)
   - setFilters(filters: Filters)
   - setLoading(loading: boolean)
   - setError(error: string | null)
   - reset()

4. 계산된 상태 (Selector):
   - filteredSchedules: Schedule[] (필터 적용)
   - schedulesByDate: Map<string, Schedule[]>
   - stats: { total, byStatus, byPriority }

5. 지속성:
   - localStorage에 상태 저장
   - 새로고침 후 상태 복원

6. 성능:
   - 메모이제이션
   - 불필요한 리렌더링 방지

완벽한 상태 관리 로직을 구현하세요.
```

---

## ✅ 테스트 프롬프트

### 프롬프트 9: 단위 테스트 작성

```
Jest와 React Testing Library를 사용하여 Schedule Manager의 단위 테스트를 작성하세요.

테스트 대상:
1. Calendar.tsx
   - 달력 렌더링
   - 날짜 클릭 이벤트
   - 월 이동 기능

2. ScheduleForm.tsx
   - 폼 검증
   - 입력 필드 렌더링
   - 제출 이벤트

3. API 함수
   - getSchedules()
   - createSchedule()
   - updateSchedule()
   - deleteSchedule()

테스트 구조:
- describe 블록으로 그룹화
- 각 기능별 테스트 케이스
- Mock 데이터 사용
- 성공/실패 시나리오 포함

커버리지 목표:
- 최소 80% 라인 커버리지
- 중요 함수는 100% 커버리지

테스트 파일명: *.test.ts 또는 *.spec.ts
테스트 위치: src/__tests__/
```

### 프롬프트 10: 통합 테스트

```
통합 테스트를 작성하여 전체 애플리케이션 플로우를 테스트하세요.

테스트 시나리오:
1. 일정 생성 → 달력 업데이트 → 검색 → 수정 → 삭제
2. 일자별 검색 → 결과 표시
3. 키워드 검색 → 필터링
4. API 호출 → 상태 업데이트 → UI 업데이트

테스트 도구:
- Jest
- React Testing Library
- Mock API 서버 (MSW)

기대 결과:
- 모든 기능 정상 작동
- 에러 처리 확인
- 로딩 상태 확인
- 성공 메시지 표시
```

---

## 🚀 배포 및 최적화

### 프롬프트 11: GitHub Pages 배포 설정

```
GitHub Pages를 사용하여 Schedule Manager를 배포하도록 설정하세요.

요구사항:
1. GitHub Actions 워크플로우 작성
   - 파일명: .github/workflows/deploy.yml
   - 트리거: main 브랜치에 push
   - 작업: build → deploy

2. 빌드 스크립트:
   - npm run build
   - dist/ 폴더 생성

3. 배포 설정:
   - GitHub Pages 저장소 설정
   - 배포 브랜치: gh-pages
   - 기본 경로: /schedule1_claude1/

4. package.json 스크립트:
   - build: React 빌드
   - deploy: gh-pages에 배포

5. 환경 변수:
   - REACT_APP_API_URL: 백엔드 API 주소
   - REACT_APP_ENV: production

6. 확인:
   - 배포 URL: https://kiuza1004.github.io/schedule1_claude1/

완벽한 배포 설정을 제공하세요.
```

### 프롬프트 12: 성능 최적화

```
Schedule Manager의 성능을 최적화하세요.

최적화 항목:
1. React 최적화:
   - React.memo 사용
   - useMemo 활용
   - useCallback 최적화
   - 가상화 (큰 리스트)

2. 번들 최적화:
   - 코드 스플리팅
   - 동적 import
   - 트리 셰이킹
   - 압축

3. 이미지 최적화:
   - WebP 형식
   - 반응형 이미지
   - 레이지 로딩

4. API 최적화:
   - 요청 디바운싱
   - 캐싱
   - 페이지네이션

5. 데이터베이스 최적화:
   - 인덱스 추가
   - 쿼리 최적화
   - 배치 처리

6. 측정:
   - Lighthouse 점수 > 90
   - 초기 로딩 < 2초
   - API 응답 < 500ms

성능 개선 보고서를 제공하세요.
```

---

## 📝 사용 가이드

### 각 프롬프트 사용 방식:

1. **프롬프트 복사**: 위의 프롬프트를 그대로 복사
2. **문맥 추가**: 필요시 프로젝트의 현재 상태 설명
3. **세부 요청**: 특정 부분에 대한 추가 요청
4. **검토**: 생성된 코드 검토 및 개선 요청

### 예시:

```
프롬프트 3을 사용하려면:

"여기는 내 Schedule Manager 프로젝트입니다.
GitHub: https://github.com/kiuza1004/schedule1_claude1

[프롬프트 3 전체 복사]

추가로, 다크 모드도 지원하도록 해주세요."
```

---

## 🎯 개발 체크리스트

- [ ] 프로젝트 초기화 (프롬프트 1-2)
- [ ] 달력 컴포넌트 개발 (프롬프트 3)
- [ ] 폼 컴포넌트 개발 (프롬프트 4)
- [ ] 검색 기능 개발 (프롬프트 5)
- [ ] 모달 개발 (프롬프트 6)
- [ ] Backend API 개발 (프롬프트 7)
- [ ] 상태 관리 구현 (프롬프트 8)
- [ ] 단위 테스트 (프롬프트 9)
- [ ] 통합 테스트 (프롬프트 10)
- [ ] GitHub Pages 배포 (프롬프트 11)
- [ ] 성능 최적화 (프롬프트 12)

---

**작성일**: 2026-04-18  
**버전**: 1.0.0  
**작성자**: Development Team


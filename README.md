# Schedule Manager - 개발 일정 및 프롬프트 관리 앱

## 🎯 프로젝트 개요

개발 중인 다양한 기능들의 **타이틀, 프롬프트, 진행 일정**을 체계적으로 관리하는 웹 애플리케이션입니다.
텍스트 파일로 흩어져 있던 개발 내용을 데이터베이스 기반의 앱으로 통합 관리합니다.

---

## ✨ 주요 기능

### 1. 달력 기반 일정 관리
- 월간/주간 달력 뷰
- 해당 날짜의 개발 항목 시각화
- 날짜별 개발 내용 빠른 조회

### 2. 개발 항목 등록
- **개발 타이틀**: 개발하는 기능명
- **개발 내용**: 상세 설명 및 요구사항
- **프롬프트**: AI에게 제공할 상세 프롬프트
- **개발 시기**: 날짜 선택
- **상태**: 계획/진행중/완료

### 3. 검색 기능
- **일자별 검색**: 특정 날짜의 모든 개발 항목 조회
- **키워드 검색**: 타이틀, 내용, 프롬프트 전체에서 검색
- **상태별 필터링**: 계획/진행중/완료

### 4. CRUD 작업
- ✅ **생성(C)**: 새 개발 항목 추가
- ✅ **읽기(R)**: 항목 상세 조회
- ✅ **수정(U)**: 기존 항목 수정 (확인 팝업)
- ✅ **삭제(D)**: 항목 삭제 (확인 팝업)

---

## 🛠️ 기술 스택

### Frontend
- **프레임워크**: React 18 + TypeScript
- **UI 라이브러리**: React Calendar
- **스타일링**: Tailwind CSS
- **상태관리**: Zustand
- **데이터 페칭**: React Query
- **폼 관리**: React Hook Form

### Backend
- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **데이터베이스**: SQLite3 (로컬 저장소)
- **ORM**: Prisma
- **API 문서**: Swagger/OpenAPI

### DevOps
- **배포**: GitHub Pages (정적) / Vercel (권장)
- **CI/CD**: GitHub Actions
- **버전 관리**: Git + GitHub

---

## 📁 프로젝트 구조

```
schedule1_claude1/
├── docs/                          # 프로젝트 문서
│   ├── PRD.md                     # 제품 요구사항 문서
│   ├── API_SPECS.md               # API 명세서
│   └── DATABASE_SCHEMA.md         # 데이터베이스 스키마
├── src/
│   ├── frontend/                  # React 애플리케이션
│   │   ├── public/
│   │   ├── components/
│   │   │   ├── Calendar/
│   │   │   ├── ScheduleForm/
│   │   │   ├── ScheduleList/
│   │   │   └── Modal/
│   │   ├── pages/
│   │   ├── store/                 # Zustand 상태관리
│   │   ├── services/              # API 호출 서비스
│   │   ├── styles/
│   │   └── App.tsx
│   └── backend/                   # Node.js + Express 서버
│       ├── routes/
│       │   └── schedules.ts       # 일정 API 엔드포인트
│       ├── models/
│       │   └── Schedule.ts        # DB 모델
│       ├── middleware/
│       ├── utils/
│       └── server.ts
├── config/
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
├── .github/
│   └── workflows/
│       ├── deploy.yml             # GitHub Pages 배포
│       └── tests.yml              # 테스트 자동화
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 시작하기

### 설치
```bash
git clone https://github.com/kiuza1004/schedule1_claude1.git
cd schedule1_claude1
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드 및 배포
```bash
npm run build
npm run deploy
```

---

## 📋 데이터 모델

### Schedule 항목
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "prompt": "string",
  "startDate": "date",
  "status": "enum(plan, in-progress, completed)",
  "priority": "enum(low, medium, high)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

---

## 📝 GitHub 배포

**리포지토리**: https://github.com/kiuza1004/schedule1_claude1

### 배포 전략
1. **Main 브랜치**: 안정적인 배포 버전
2. **Develop 브랜치**: 개발 버전
3. **Feature 브랜치**: 개별 기능 개발

### 배포 프로세스
```bash
# 1. develop 브랜치에서 작업
git checkout develop

# 2. feature 브랜치 생성
git checkout -b feature/새기능

# 3. 작업 완료 후 커밋
git add .
git commit -m "feat: 새기능 추가"

# 4. develop에 PR 제출
git push origin feature/새기능

# 5. develop에서 main으로 병합 (GitHub Actions 자동 배포)
```

---

## ✅ 개발 체크리스트

- [ ] 프로젝트 초기 설정
- [ ] 데이터베이스 스키마 정의
- [ ] Backend API 개발
- [ ] Frontend UI 컴포넌트 개발
- [ ] 일자별 검색 기능
- [ ] 키워드 검색 기능
- [ ] 수정/삭제 확인 팝업
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] GitHub Pages 배포

---

## 📞 문의 및 지원

문제가 발생하면 GitHub Issues에서 보고해주세요.

---

**마지막 업데이트**: 2026-04-18

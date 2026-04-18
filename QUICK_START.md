# 빠른 시작 가이드 - Schedule Manager

이 가이드를 따라 Schedule Manager 개발을 시작하세요.

## 📖 프로젝트 구조 이해

```
schedule1_claude1/
├── docs/                          # 📚 프로젝트 문서
│   ├── PRD.md                     # 제품 요구사항 정의
│   ├── DEVELOPMENT_PROMPT.md      # AI 개발용 프롬프트 ⭐
│   ├── API_SPECS.md               # REST API 명세
│   └── DATABASE_SCHEMA.md         # 데이터베이스 스키마
├── src/
│   ├── frontend/                  # ⚛️ React 앱
│   └── backend/                   # 🔧 Express 서버
├── config/                        # ⚙️ 설정 파일
├── .github/workflows/             # 🚀 배포 자동화
├── README.md                      # 프로젝트 개요
├── CONTRIBUTING.md                # 기여 가이드
└── package.json                   # 의존성 관리
```

## 🚀 5분 안에 시작하기

### 1단계: 저장소 클론

```bash
git clone https://github.com/kiuza1004/schedule1_claude1.git
cd schedule1_claude1
```

### 2단계: 환경 설정

```bash
# 환경 파일 생성
cp .env.example .env

# 의존성 설치
npm run install:all
```

### 3단계: 데이터베이스 초기화

```bash
npm run db:setup
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

✅ 완료! 다음 주소에서 앱을 확인하세요:
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001/api

## 🎯 주요 파일과 용도

| 파일 | 용도 | 언제 읽어야 하나 |
|------|------|-----------------|
| **docs/DEVELOPMENT_PROMPT.md** | 🤖 Claude로 개발할 때 | **항상 먼저!** |
| **docs/PRD.md** | 📋 기능 요구사항 | 새 기능 추가 시 |
| **docs/API_SPECS.md** | 🔌 API 엔드포인트 | 백엔드 개발 시 |
| **docs/DATABASE_SCHEMA.md** | 💾 DB 설계 | 데이터 모델 변경 시 |
| **README.md** | 📚 프로젝트 개요 | 프로젝트 이해 시 |

## 💻 주요 명령어

```bash
# 개발
npm run dev                    # 전체 앱 실행
npm run dev:frontend          # React만 실행
npm run dev:backend           # Express만 실행

# 테스트
npm run test                  # 모든 테스트 실행
npm run test:frontend         # React 테스트만
npm run test:backend          # Express 테스트만

# 코드 품질
npm run lint                  # 린터 실행
npm run format                # 코드 자동 포맷팅
npm run type-check            # TypeScript 타입 체크

# 데이터베이스
npm run db:setup              # 초기 설정
npm run db:push               # 스키마 적용
npm run db:reset              # 데이터 초기화

# 배포
npm run build                 # 프로덕션 빌드
npm run deploy                # GitHub Pages 배포
```

## 🤖 Claude로 개발하기

> 🎯 **가장 중요한 문서**: [docs/DEVELOPMENT_PROMPT.md](docs/DEVELOPMENT_PROMPT.md)

### 1단계: 프롬프트 복사

프롬프트를 선택하고 복사합니다:

```
프롬프트 3: 달력 컴포넌트 개발
프롬프트 4: 일정 등록 폼 개발
프롬프트 5: 검색 기능 개발
... 등등
```

### 2단계: Claude에게 제시

```
당신은 React + TypeScript 개발자입니다.

현재 프로젝트: Schedule Manager
GitHub: https://github.com/kiuza1004/schedule1_claude1

[문서에서 복사한 프롬프트]

추가 요청: [필요시 추가 사항]
```

### 3단계: 코드 적용

Claude가 생성한 코드를 적절한 폴더에 저장합니다:

```bash
# 예: 달력 컴포넌트
# 위치: src/frontend/components/Calendar/Calendar.tsx
```

### 4단계: 테스트

```bash
npm run dev
npm run lint
npm run test
```

## 📋 일반적인 개발 시나리오

### 시나리오 1: 새로운 컴포넌트 추가

```bash
# 1. 프롬프트 준비
# docs/DEVELOPMENT_PROMPT.md에서 해당 프롬프트 찾기

# 2. Claude에 요청
# 프롬프트 + 현재 프로젝트 URL 제시

# 3. 코드 생성 및 저장
# src/frontend/components/에 저장

# 4. 테스트
npm run dev
npm run lint
```

### 시나리오 2: API 엔드포인트 추가

```bash
# 1. API 명세 확인
# docs/API_SPECS.md 참고

# 2. 데이터베이스 스키마 확인
# docs/DATABASE_SCHEMA.md 참고

# 3. 프롬프트 7: Backend API 개발 사용
# src/backend/routes/에 구현

# 4. 테스트
npm run test:backend
```

### 시나리오 3: 버그 수정

```bash
# 1. 버그 파악
# 어느 컴포넌트/기능에서 발생하는가?

# 2. 원인 분석
# 로그, 콘솔 에러 확인

# 3. 수정
# 해당 파일 수정

# 4. 테스트
npm run test
npm run dev
```

## 🔍 문제 해결

### 포트 충돌 문제

```bash
# .env 파일에서 포트 변경
PORT=3001
FRONTEND_PORT=3001
```

### 데이터베이스 에러

```bash
# 데이터베이스 초기화
npm run db:reset

# 마이그레이션 상태 확인
cd src/backend
npx prisma migrate status
```

### 의존성 문제

```bash
# 캐시 삭제 및 재설치
npm run clean:all
npm run install:all
```

### 빌드 에러

```bash
# 타입 체크
npm run type-check

# 린트 오류 확인
npm run lint
```

## 📚 다음 단계

1. ✅ 프로젝트 실행 성공
2. 📖 [PRD.md](docs/PRD.md) 읽기 - 기능 이해
3. 🤖 [DEVELOPMENT_PROMPT.md](docs/DEVELOPMENT_PROMPT.md) 읽기
4. 💻 첫 번째 기능 개발 시작
5. 🧪 테스트 작성
6. 🚀 배포

## 🎓 추가 학습

### Frontend 개발
- React 공식 문서: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Hook Form: https://react-hook-form.com

### Backend 개발
- Express 문서: https://expressjs.com
- Prisma ORM: https://www.prisma.io/docs
- SQLite: https://www.sqlite.org/docs.html

### 배포
- GitHub Pages: https://pages.github.com
- Vercel: https://vercel.com/docs
- GitHub Actions: https://github.com/features/actions

## 💡 팁과 트릭

### 개발 속도 향상

1. **VS Code 확장 설치**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prisma
   - Thunder Client (API 테스트)

2. **개발 도구 사용**
   - React DevTools 브라우저 확장
   - Redux DevTools (상태 디버깅)

3. **자동화 활용**
   - Pre-commit 훅으로 린트 자동 실행
   - VS Code 저장 시 자동 포맷팅

### 코드 품질

```bash
# 모든 체크 한 번에
npm run lint && npm run type-check && npm run test
```

## 🤝 도움 받기

- **GitHub Issues**: 기술 문제
- **GitHub Discussions**: 일반 질문
- **CONTRIBUTING.md**: 기여 방법

## 📝 체크리스트

시작하기 전에 다음을 확인하세요:

- [ ] Node.js 18+ 설치 확인
- [ ] 저장소 클론 완료
- [ ] npm install:all 실행 완료
- [ ] .env 파일 설정 완료
- [ ] npm run db:setup 완료
- [ ] npm run dev로 앱 실행 확인
- [ ] 프롬프트 문서 읽음

---

**축하합니다! 🎉 Schedule Manager 개발을 시작할 준비가 완료되었습니다!**

질문이 있으면 언제든지 GitHub Issues를 통해 문의해주세요.


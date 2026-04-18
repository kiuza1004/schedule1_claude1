# Contributing to Schedule Manager

이 문서는 Schedule Manager 프로젝트에 기여하는 방법을 설명합니다.

## 🚀 시작하기

### 1. 저장소 포크 및 클론

```bash
# 저장소 포크 (GitHub 웹에서)
# 그 후 로컬에 클론
git clone https://github.com/YOUR_USERNAME/schedule1_claude1.git
cd schedule1_claude1
```

### 2. 개발 환경 설정

```bash
# 의존성 설치
npm install:all

# 환경 설정 파일 생성
cp .env.example .env

# 데이터베이스 설정
npm run db:setup

# 개발 서버 실행
npm run dev
```

## 🔄 개발 워크플로우

### 1. 브랜치 생성

```bash
# 새 브랜치 생성 (develop에서 시작)
git checkout develop
git checkout -b feature/새기능이름

# 또는 버그 수정
git checkout -b bugfix/버그이름

# 또는 문서 업데이트
git checkout -b docs/문서이름
```

### 2. 커밋 메시지 컨벤션

```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입 종류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 업데이트
- `style`: 코드 스타일 (포맷팅, 세미콜론 등)
- `refactor`: 코드 리팩토링
- `perf`: 성능 개선
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드, 의존성 등 기타 변경

**예시:**
```
feat(calendar): 월간 달력 뷰 추가

- 달력 컴포넌트 구현
- 날짜별 항목 표시
- 이전/다음 월 네비게이션

Closes #123
```

### 3. 코드 스타일 지키기

```bash
# 코드 포맷팅
npm run format

# 린터 실행
npm run lint

# 타입 체크
npm run type-check
```

### 4. 테스트 작성

```bash
# 테스트 실행
npm run test

# 커버리지 확인
npm run test -- --coverage
```

### 5. Pull Request 생성

```bash
# 변경사항 푸시
git push origin feature/새기능이름

# GitHub에서 PR 생성
# - 명확한 제목 작성
# - 상세한 설명 포함
# - 관련 이슈 링크
# - 변경사항 스크린샷 (UI 변경시)
```

## 📋 코드 리뷰 체크리스트

PR 검토 시 다음 사항을 확인하세요:

- [ ] 코드가 프로젝트 스타일 가이드를 따르는가
- [ ] 모든 테스트가 통과하는가
- [ ] 새로운 기능에 대한 테스트가 있는가
- [ ] 문서가 업데이트되었는가
- [ ] 타입 에러가 없는가
- [ ] 콘솔 경고/에러가 없는가
- [ ] 성능 이슈가 없는가
- [ ] 보안 이슈가 없는가

## 🎨 코드 스타일 가이드

### TypeScript

```typescript
// ✅ 좋은 예
interface Schedule {
  id: string;
  title: string;
  status: ScheduleStatus;
  createdAt: Date;
}

const getSchedules = async (page: number): Promise<Schedule[]> => {
  // ...
};

// ❌ 안 좋은 예
interface schedule {
  id: any;
  title: any;
}

const getSchedules = (page) => {
  // ...
};
```

### React/TSX

```typescript
// ✅ 좋은 예
interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate
}) => {
  // ...
  return <div>{/* JSX */}</div>;
};

// ❌ 안 좋은 예
export const Calendar = (props) => {
  // ...
};
```

### CSS/Tailwind

```typescript
// ✅ 좋은 예
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
  클릭
</button>

// ❌ 안 좋은 예
<button style={{ padding: '8px 16px', background: 'blue' }}>
  클릭
</button>
```

## 📚 문서 작성

새로운 기능을 추가할 때는 다음 문서를 업데이트하세요:

1. **README.md**: 프로젝트 개요
2. **docs/PRD.md**: 기능 요구사항
3. **docs/API_SPECS.md**: API 명세
4. **docs/DEVELOPMENT_PROMPT.md**: 개발 프롬프트
5. **docs/DATABASE_SCHEMA.md**: 데이터베이스 스키마

## 🐛 버그 리포팅

버그를 발견했다면:

1. **이슈 확인**: 이미 보고된 버그인지 확인
2. **이슈 생성**: 명확한 제목과 설명으로 이슈 생성
3. **정보 포함**:
   - 재현 방법
   - 예상 결과
   - 실제 결과
   - 환경 정보 (OS, 브라우저, Node 버전 등)
   - 스크린샷/로그

## ✨ 기능 요청

새로운 기능을 제안할 때는:

1. **제목**: 명확한 기능 설명
2. **설명**: 상세한 요구사항
3. **사용 사례**: 실제 사용 시나리오
4. **디자인**: UI/UX 스케치 (선택사항)

## 📝 라이센스

이 프로젝트에 기여함으로써, 당신의 기여는 MIT 라이센스 하에 배포됨을 동의합니다.

## 🎯 커뮤니티 가이드라인

- 존중과 포용성을 유지하세요
- 건설적인 피드백을 제공하세요
- 다양한 의견을 존중하세요
- 스팸이나 부적절한 콘텐츠를 삼가세요

## 📞 연락처

질문이나 제안사항이 있으면:

- GitHub Issues: 기술적 문제
- GitHub Discussions: 일반 질문

---

감사합니다! 🙏 당신의 기여는 이 프로젝트를 더 좋게 만듭니다!

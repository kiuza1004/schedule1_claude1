# API 명세서 - Schedule Manager

**버전**: 1.0.0  
**마지막 업데이트**: 2026-04-18

---

## 📌 개요

Schedule Manager REST API는 일정 관리 애플리케이션의 모든 백엔드 기능을 제공합니다.
모든 요청/응답은 JSON 형식이며, 적절한 HTTP 상태 코드를 반환합니다.

### 기본 정보

| 항목 | 값 |
|------|-----|
| **Base URL** | `https://api.example.com/api` |
| **버전** | `v1` |
| **응답 형식** | JSON |
| **인증** | 선택사항 (v2.0에서 추가 예정) |

---

## 🔐 인증

현재 버전에서는 인증이 필수가 아닙니다.
v2.0에서 JWT 기반 인증이 추가될 예정입니다.

### 인증 헤더 (향후)
```
Authorization: Bearer <token>
```

---

## 📊 공통 응답 형식

모든 API 응답은 다음 형식을 따릅니다:

### 성공 응답 (200-299)
```json
{
  "success": true,
  "data": {},
  "message": "작업이 완료되었습니다",
  "timestamp": "2026-04-18T12:00:00Z"
}
```

### 에러 응답 (400-599)
```json
{
  "success": false,
  "data": null,
  "message": "에러 메시지",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 설명"
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

## 🔄 HTTP 상태 코드

| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 201 | Created | 새 리소스 생성 |
| 204 | No Content | 콘텐츠 없음 (삭제 성공) |
| 400 | Bad Request | 잘못된 요청 |
| 404 | Not Found | 리소스 없음 |
| 422 | Unprocessable Entity | 입력 검증 실패 |
| 500 | Internal Server Error | 서버 에러 |

---

## 📚 데이터 모델

### Schedule 객체

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "사용자 인증 시스템 개발",
  "description": "JWT 기반의 사용자 인증 시스템을 구현합니다.",
  "prompt": "React와 Express를 사용하여 JWT 기반 인증 시스템을 구현하세요...",
  "startDate": "2026-04-18",
  "status": "in-progress",
  "priority": "high",
  "tags": ["auth", "security", "backend"],
  "createdAt": "2026-04-18T10:30:00Z",
  "updatedAt": "2026-04-18T12:00:00Z"
}
```

### 필드 설명

| 필드 | 타입 | 설명 | 제약사항 |
|------|------|------|---------|
| id | string (UUID) | 고유 식별자 | 자동 생성 |
| title | string | 개발 항목 제목 | 1-100자 |
| description | string | 상세 설명 | 1-1000자 |
| prompt | string | AI 프롬프트 | 1-5000자 |
| startDate | date | 개발 예정일 | YYYY-MM-DD |
| status | enum | 진행 상태 | plan, in-progress, completed |
| priority | enum | 우선순위 | low, medium, high |
| tags | array | 태그 목록 | 최대 10개 |
| createdAt | timestamp | 생성 일시 | ISO 8601 |
| updatedAt | timestamp | 수정 일시 | ISO 8601 |

---

## 🔌 엔드포인트

### 1. 일정 생성

**요청**
```http
POST /schedules
Content-Type: application/json

{
  "title": "사용자 인증 시스템",
  "description": "JWT 기반 인증 구현",
  "prompt": "React와 Express를 사용하여...",
  "startDate": "2026-04-18",
  "status": "plan",
  "priority": "high",
  "tags": ["auth"]
}
```

**성공 응답** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "사용자 인증 시스템",
    "description": "JWT 기반 인증 구현",
    "prompt": "React와 Express를 사용하여...",
    "startDate": "2026-04-18",
    "status": "plan",
    "priority": "high",
    "tags": ["auth"],
    "createdAt": "2026-04-18T12:00:00Z",
    "updatedAt": "2026-04-18T12:00:00Z"
  },
  "message": "일정이 생성되었습니다",
  "timestamp": "2026-04-18T12:00:00Z"
}
```

**에러 응답** (422 Unprocessable Entity)
```json
{
  "success": false,
  "data": null,
  "message": "입력 검증 실패",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "title": "필수 필드입니다",
      "prompt": "최대 5000자까지 입력 가능합니다"
    }
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

**검증 규칙**
- title: 필수, 1-100자
- description: 필수, 1-1000자
- prompt: 필수, 1-5000자
- startDate: 필수, YYYY-MM-DD 형식
- status: 선택, plan|in-progress|completed
- priority: 선택, low|medium|high

---

### 2. 모든 일정 조회

**요청**
```http
GET /schedules?page=1&limit=10&sort=date&order=desc
```

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| page | integer | 1 | 페이지 번호 |
| limit | integer | 10 | 한 페이지 항목 수 |
| sort | string | date | 정렬 기준: date, priority, status |
| order | string | desc | 정렬 순서: asc, desc |

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "사용자 인증 시스템",
      "description": "JWT 기반 인증 구현",
      "prompt": "React와 Express를 사용하여...",
      "startDate": "2026-04-18",
      "status": "in-progress",
      "priority": "high",
      "tags": ["auth"],
      "createdAt": "2026-04-18T10:00:00Z",
      "updatedAt": "2026-04-18T12:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "UI 개선",
      "description": "반응형 디자인 적용",
      "prompt": "Tailwind CSS를 사용하여...",
      "startDate": "2026-04-19",
      "status": "plan",
      "priority": "medium",
      "tags": ["frontend"],
      "createdAt": "2026-04-18T11:00:00Z",
      "updatedAt": "2026-04-18T11:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

### 3. 특정 일정 조회

**요청**
```http
GET /schedules/550e8400-e29b-41d4-a716-446655440000
```

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "사용자 인증 시스템",
    "description": "JWT 기반 인증 구현",
    "prompt": "React와 Express를 사용하여...",
    "startDate": "2026-04-18",
    "status": "in-progress",
    "priority": "high",
    "tags": ["auth"],
    "createdAt": "2026-04-18T10:00:00Z",
    "updatedAt": "2026-04-18T12:00:00Z"
  },
  "message": "일정을 조회했습니다",
  "timestamp": "2026-04-18T12:00:00Z"
}
```

**에러 응답** (404 Not Found)
```json
{
  "success": false,
  "data": null,
  "message": "일정을 찾을 수 없습니다",
  "error": {
    "code": "NOT_FOUND",
    "details": "ID: 550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

### 4. 일정 검색

**요청**
```http
GET /schedules/search?q=인증&status=in-progress&priority=high
```

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| q | string | 아니오 | 검색 키워드 |
| status | string | 아니오 | 상태 필터 |
| priority | string | 아니오 | 우선순위 필터 |
| startDate | date | 아니오 | 시작 날짜 |
| endDate | date | 아니오 | 종료 날짜 |

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "사용자 인증 시스템",
      "description": "JWT 기반 인증 구현",
      "prompt": "React와 Express를 사용하여...",
      "startDate": "2026-04-18",
      "status": "in-progress",
      "priority": "high",
      "tags": ["auth"],
      "createdAt": "2026-04-18T10:00:00Z",
      "updatedAt": "2026-04-18T12:00:00Z"
    }
  ],
  "meta": {
    "count": 1,
    "query": "인증",
    "filters": {
      "status": "in-progress",
      "priority": "high"
    }
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

### 5. 날짜별 일정 조회

**요청**
```http
GET /schedules/date/2026-04-18
```

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "사용자 인증 시스템",
      "description": "JWT 기반 인증 구현",
      "prompt": "React와 Express를 사용하여...",
      "startDate": "2026-04-18",
      "status": "in-progress",
      "priority": "high",
      "tags": ["auth"],
      "createdAt": "2026-04-18T10:00:00Z",
      "updatedAt": "2026-04-18T12:00:00Z"
    }
  ],
  "meta": {
    "date": "2026-04-18",
    "count": 1
  },
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

### 6. 일정 수정

**요청**
```http
PUT /schedules/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "사용자 인증 시스템 (수정됨)",
  "status": "completed",
  "priority": "medium"
}
```

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "사용자 인증 시스템 (수정됨)",
    "description": "JWT 기반 인증 구현",
    "prompt": "React와 Express를 사용하여...",
    "startDate": "2026-04-18",
    "status": "completed",
    "priority": "medium",
    "tags": ["auth"],
    "createdAt": "2026-04-18T10:00:00Z",
    "updatedAt": "2026-04-18T12:30:00Z"
  },
  "message": "일정이 수정되었습니다",
  "timestamp": "2026-04-18T12:30:00Z"
}
```

---

### 7. 일정 삭제

**요청**
```http
DELETE /schedules/550e8400-e29b-41d4-a716-446655440000
```

**성공 응답** (204 No Content)
```
(본문 없음)
```

또는

```json
{
  "success": true,
  "data": null,
  "message": "일정이 삭제되었습니다",
  "timestamp": "2026-04-18T12:30:00Z"
}
```

**에러 응답** (404 Not Found)
```json
{
  "success": false,
  "data": null,
  "message": "일정을 찾을 수 없습니다",
  "error": {
    "code": "NOT_FOUND",
    "details": "ID: 550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2026-04-18T12:30:00Z"
}
```

---

### 8. 통계 조회

**요청**
```http
GET /schedules/stats
```

**성공 응답** (200 OK)
```json
{
  "success": true,
  "data": {
    "total": 25,
    "byStatus": {
      "plan": 10,
      "in-progress": 8,
      "completed": 7
    },
    "byPriority": {
      "low": 5,
      "medium": 12,
      "high": 8
    },
    "thisMonth": 15,
    "thisWeek": 3,
    "today": 1
  },
  "message": "통계를 조회했습니다",
  "timestamp": "2026-04-18T12:00:00Z"
}
```

---

## 🔍 Error Codes

| 코드 | HTTP | 설명 |
|------|------|------|
| VALIDATION_ERROR | 422 | 입력 검증 실패 |
| NOT_FOUND | 404 | 리소스 없음 |
| DUPLICATE_TITLE | 422 | 중복된 제목 |
| INVALID_DATE | 422 | 잘못된 날짜 형식 |
| INVALID_STATUS | 422 | 잘못된 상태 값 |
| INVALID_PRIORITY | 422 | 잘못된 우선순위 값 |
| DATABASE_ERROR | 500 | 데이터베이스 에러 |
| SERVER_ERROR | 500 | 서버 에러 |

---

## 📝 예제 Curl 명령어

### 일정 생성
```bash
curl -X POST http://localhost:3000/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "title": "사용자 인증 시스템",
    "description": "JWT 기반 인증 구현",
    "prompt": "React와 Express를 사용하여 JWT 기반 인증 시스템을 구현하세요",
    "startDate": "2026-04-18",
    "status": "plan",
    "priority": "high"
  }'
```

### 모든 일정 조회
```bash
curl -X GET "http://localhost:3000/api/schedules?page=1&limit=10"
```

### 일정 검색
```bash
curl -X GET "http://localhost:3000/api/schedules/search?q=인증&status=in-progress"
```

### 일정 수정
```bash
curl -X PUT http://localhost:3000/api/schedules/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 일정 삭제
```bash
curl -X DELETE http://localhost:3000/api/schedules/550e8400-e29b-41d4-a716-446655440000
```

---

## ⚡ Rate Limiting

현재 버전에서는 Rate Limiting을 적용하지 않습니다.
v2.0에서 IP별 Rate Limiting이 추가될 예정입니다.

---

## 🔒 CORS 설정

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📋 Changelog

### v1.0.0 (2026-04-18)
- 초기 API 명세 작성
- CRUD 엔드포인트 정의
- 검색 및 필터링 기능
- 통계 엔드포인트

---

**작성일**: 2026-04-18  
**작성자**: Development Team  
**마지막 업데이트**: 2026-04-18


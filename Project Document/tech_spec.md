# 기술 사양 문서 (Technical Specifications)

이 문서는 프로젝트의 기술적 구현 방식, 아키텍처 및 데이터 관련 상세 내용을 다룹니다.

## 1. 기술 스택 (Tech Stack)
- **프론트엔드**: Next.js (React), Vanilla CSS
- **상태 관리**: Zustand (경량 상태 관리 라이브러리)
- **백엔드/데이터베이스**: Supabase
    - **PostgreSQL**: 주 데이터베이스
    - **Realtime (WebSockets)**: 멀티플레이어 게임 동기화
    - **Auth**: 사용자 인증 및 세션 관리
    - **Edge Functions**: 게임 로직 및 보안 가드 (족보 판별, 베팅 검증 등)

## 2. 시스템 아키텍처 (선택 사항)
현재 **Supabase 기반의 Serverless 아키텍처**를 권장합니다.

- **방법 A: 호스트-클라이언트 (P2P)**:
    - 장점: 서버 비용 최소화.
    - 단점: 호스트가 나가면 방이 터짐, 브라우저 환경에서 WebRTC 연결이 불안정할 수 있음, 치트 방지가 어려움.
- **방법 B: Supabase (초기/MVP 단계 - 권장)**:
    - **중앙 집중 방식**: 모든 상태를 Supabase DB와 Realtime으로 관리. 
    - **신뢰성**: 호스트가 나가도 게임 유지됨.
    - **보안**: Edge Functions를 사용하여 연산 처리.
- **방법 C: 고유 서버 (나중에 고려 - 포팅 단계)**:
    - **전용 서버**: PKS/Node.js 환경으로 이전. 세밀한 커스터마이징이 필요할 때 진행.

## 3. 개발 로드맵 (Phased Approach)
- **Phase 1 (MVP)**: Supabase를 활용하여 빠르게 핵심 게임 로직(베팅, 쇼다운) 구현.
- **Phase 2 (Migration)**: 게임이 안정화되면 동아리 서버(PKS)로 로직을 포팅하여 운영 비용 절감 및 확장성 확보.
- **전략**: 게임 로직을 순수 TypeScript/JavaScript로 작성하여, 프레임워크(Supabase/Node)에 의존하지 않고 재사용 가능하게 관리.

## 4. 데이터베이스 스키마 설계 (Supabase)

### `rooms` (게임 방)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | PK, 방 식별자 |
| `name` | text | 방 제목 |
| `status` | text | `waiting`, `playing`, `finished` |
| `max_players`| int | 최대 인원 (6명) |
| `carryover_tokens` | int | 무승부 시 이월된 토큰 합계 |

### `players` (참가자)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | PK, 유저 식별자 |
| `room_id` | uuid | FK (rooms.id) |
| `user_id` | uuid | FK (auth.users) |
| `slot_index` | int | 테이블 위치 (0~5) |
| `tokens` | int | 현재 보유 토큰 (초기 25개) |
| `status` | text | `active`, `folded`, `all-in`, `away` |

### `game_sessions` (진행 중인 판 정보)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | PK |
| `room_id` | uuid | FK (rooms.id) |
| `phase` | text | `pre-flop`, `flop`, `turn`, `river`, `showdown` |
| `community_cards` | jsonb | 공개된 카드 리스트 |
| `pot_size` | int | 현재 판돈 합계 |
| `current_turn` | uuid | 현재 베팅 차례인 플레이어 ID |
| `dealer_index` | int | 딜러 버튼 위치 |

### `actions` (베팅 로그)
- 모든 베팅 기록을 저장하여 게임 복구 및 히스토리 확인용으로 사용.

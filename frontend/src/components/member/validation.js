// src/components/member/validation.js
export const validate = {
  memberId: (v) =>
    !/^[a-zA-Z0-9_]{4,20}$/.test(v)
      ? '아이디는 4~20자의 영문, 숫자, 밑줄(_)만 사용 가능합니다.'
      : '',
  password: (v) =>
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,60}$/.test(v)
      ? '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.'
      : '',
  name: (v) =>
    !/^[가-힣]{2,10}$/.test(v) ? '한글 이름 2~10자를 입력해주세요.' : '',
  nickname: (v) =>
    !/^[가-힣a-zA-Z0-9_]{2,20}$/.test(v)
      ? '닉네임은 2~20자의 한글/영문/숫자/밑줄(_)만 가능합니다.'
      : '',
  email: (v) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '유효한 이메일 형식이 아닙니다.' : '',
  phone: (v) =>
    !/^01[0-9]{1}-?[0-9]{3,4}-?[0-9]{4}$/.test(v)
      ? '010-XXXX-XXXX 형식으로 입력해주세요.'
      : '',
  address: (v) => (v.trim().length < 5 ? '주소를 5자 이상 입력해주세요.' : ''),
  birthdate: (v) =>
    !/^\d{4}-\d{2}-\d{2}$/.test(v) ? 'YYYY-MM-DD 형식으로 입력해주세요.' : '',
  gender: (v) => (!['남', '여'].includes(v) ? '성별을 선택해주세요.' : ''),
  /* --- 새로 추가된 장르 검증 --- */
  genres: (arr) => {
    if (arr.length > 5) return '관심 장르는 최대 5개까지 선택 가능합니다.';
    return '';
  }
};

//재활용성이 높은 코드들은 빼둬서 가져오는 식으로 활용

export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
//비밀번호의 소,대 문자, 숫자, 특수문자가의 일부를 모두 포함하는지 검사하는 함수

export const PASSWORD_REGEX_ERROR =
  "Passwords must contain at least one UPPERCASE, lowercase, number and special characters #?!@$%^&*-";

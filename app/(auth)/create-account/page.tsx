"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";

import Link from "next/link";
import Input from "../../../components/input";
import Button from "../../../components/button";
import SocialLogin from "../../../components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  //hook을 사용할려면 use client상태여야 함 그래서 새로운 파일로 use server를 만들어 임포트 해서 사용해야 함
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {/* action은 use server를 해줄 수 있음  */}
        <Input
          name="username"
          // Server action에서 form을 넘겨줘야 하기 때문에 name을 꼭 설정해 줘야 함
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
          //fieldErrors는 사용자가 입력한 필드에 대한 오류 메시지를 포함하는 객체
          minLength={3}
          maxLength={20}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}

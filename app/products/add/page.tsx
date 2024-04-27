"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useFormState } from "react-hook-form";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false); // 이미지 업로드 여부 상태
  const [isValidSize, setIsValidSize] = useState(true); // 이미지 사이즈 유효성 상태

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsImageUploaded(true); // 이미지 업로드 상태를 true로 설정
    // 이미지 사이즈가 유효한지 확인
    if (file.size > 4 * 1024 * 1024) {
      // 3-4MB 이하인지 확인 (4MB를 넘어가면 너무 큰 이미지로 간주)
      setIsValidSize(false); // 이미지 사이즈가 유효하지 않으면 상태를 false로 설정
    } else {
      setIsValidSize(true); // 이미지 사이즈가 유효하면 상태를 true로 설정
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 이미지가 업로드되었고, 이미지 사이즈가 유효한 경우에만 제품을 업로드
    if (isImageUploaded && isValidSize) {
      const formData = new FormData(event.currentTarget);
      uploadProduct(formData); // 제품 업로드 함수 호출
    } else {
      // 이미지가 업로드되지 않았거나 이미지 사이즈가 유효하지 않은 경우 오류 메시지를 표시
      alert("이미지를 업로드하거나 이미지 크기를 확인하세요.");
    }
  };

  return (
    <div>
      <form
        action={uploadProduct}
        onSubmit={onSubmit}
        className="flex flex-col gap-5 p-5"
      >
        {/* 유저가 이미지를 업로드 할 떄 form을 보기 좋게 만드는 작은 트릭 */}
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer  bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        {/* 유저가 이미지를 업로드 할 떄 form을 보기 좋게 만드는 작은 트릭 */}

        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}

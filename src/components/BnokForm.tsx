import React from "react";
import Image from "next/image";
const BnokForm = () => {
  return (
    <div className="mt-5">
      <div className="m-auto text-center justify-center mt-3">
        <p className="text-3xl font-bold">المصارف المتعامل معها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  w-full h-full items-center justify-center mt-2 p-4 gap-6">
        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/sahari.jpg"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-contain bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/motahed.png"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-contain bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/wahda.jpg"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-cover bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/gmhoria.png"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-contain bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/yaqeen.jpg"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-contain bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/alwaha.jpg"
              alt="profile-picture"
              width={200}
              height={300}
              className="object-contain bg-red border"
            />
          </div>
        </div>

        <div className="flex flex-col bg-white shadow-xl border border-slate-200 rounded-lg my-6">
          <div className="m-2.5 overflow-hidden rounded-md h-56 flex justify-center items-center">
            <Image
              src="/images/northafrica.jpg"
              alt="profile-picture"
              width={200}
              height={300}
              priority
              className="object-contain bg-red border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BnokForm;

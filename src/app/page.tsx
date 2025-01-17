"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/component/Loading";
import Cookies from "js-cookie";
import NavBar from "@/app/component/NavBar";
import ErrorDialogBox from "./component/ErrorDialogBox";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function Auth() {

  const [ErrorMessage, setErrorMessage] = useState("")
  const [ErrorStatus, setErrorStatus] = useState(false)

  // ERROR HANDLER
  const ErrorHandler = (message:string) => {
    console.log("nih pesan:", message)
    setErrorMessage(message);
    
    setErrorStatus(true);
  
    // Delay 4 detik
    setTimeout(() => {
      setErrorStatus(false);
    }, 4000); 
  }
  


  // Pengecekan Cookies
  const [cookieValue, setCookieValue] = useState<string | undefined>(
    Cookies.get("ChampID")
  );
  useEffect(() => {
    setCookieValue(Cookies.get("ChampID"));
    if (Cookies.get('AuthError')){
      ErrorHandler("AUTENTIKASI GAGAL!!")
      Cookies.remove('AuthError');
    }
  }, []);


  // Fungsi login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [LoadingCondition, setLoadingCondition] = useState(false);
  const route = useRouter();

  const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingCondition(true);

    // Struktur body request
    const requestBody = {
      username: username,
      pass: password,
      token: TOKEN,
    };

    //console.log(JSON.stringify(requestBody));

    try {
      // Melakukan POST request
      const response = await fetch(
        `${API_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Mengubah response menjadi JSON
      const data = await response.json();

      // Mengecek apakah response memiliki atribut "ID"
      if (data.ID) {
        //console.log("Login berhasil, ID:", data.ID);
        Cookies.set("ChampID", data.ID, { expires: 1 });

        route.push("/verification");

        // Lakukan sesuatu dengan ID yang didapat
      } else {
        console.log("Login gagal, pesan error:", data.message);
        setLoadingCondition(false);
        if(data.message == "Username, password, dan token harus diisi.") {
          ErrorHandler("FORM HARUS DILENGKAPI!!")
        } else {
          ErrorHandler("LOGIN TIDAK VALID!!")
        }
        

        // Tampilkan pesan error atau lakukan sesuatu
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat melakukan request:", error);
      ErrorHandler("SERVER CONNECTION ERROR")
    }
  };

  return (
    <main className="flex w-[100vw] h-[100vh]" style={{ background: 'linear-gradient(111.84deg, #DDC28E -1.42%, #77684C 65.2%)', boxShadow: '0px 4px 4px 0px #00000040' }}>
      {/* Bagian lain dari komponen */}
      <div className="Background Hero w-full h-full m-auto overflow-hidden bg-[url('/mainbg.png')] bg-cover flex">
        <div className="blankspace h-full w-[calc(100%-720px)]"/>
        <div className="loginspace h-full w-[720px] flex">
          <div className="logincontainer animate-popup m-auto block pt-12 pb-18 w-[350px] md:w-[500px] h-[400px] rounded-3xl  transition-all ease-in-out duration-6000"> {/* Warna textbox agak jelek sini aku perbaiki bg-[rgba(181,126,75,0.31)] lg:bg-[rgba(220,255,203,0.0)] */}
            <div className="title leading-tight w-full text-center text-[60pt] font-extrabold text-[#F8E5C1] font-Algerian">
              PEMIRA HME ITB
            </div>
            <div className="maincontent h-fit relative top-[-205px] block">
            <div className="title leading-tight w-full text-center text-[60pt] font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-[#221D11] via-[#221D11] to-[#A38855] font-Algerian">
              PEMIRA HME ITB
            </div>
              <form
                onSubmit={handleSubmit}
                className="inputSection block p-4 mt-[20px]"
              >
                <div className="username w-full flex pt-2 pb-2">
                  <input
                    type="text"
                    className="username w-[85%] m-auto p-2 text-black rounded-lg font-['Abhaya_Libre_ExtraBold']"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="pass w-full flex pt-2">
                  <input
                    type="password"
                    className="password w-[85%] m-auto p-2 text-black rounded-lg font-['Abhaya_Libre_ExtraBold']"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="submitsection w-full flex mt-8">
                  <button
                  type="submit"
                  className="button m-auto ButtonText pt-2 pb-2 px-6 text-black rounded-lg bg-[#B3403D] hover:bg-[#8A2C2A] transition-colors duration-300"
                  >
                  LOGIN
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      <Loading condition={LoadingCondition} />
      <NavBar data={cookieValue} />  
      <ErrorDialogBox condition={ErrorStatus} errormessage={ErrorMessage}/>
    </main>
  );
}
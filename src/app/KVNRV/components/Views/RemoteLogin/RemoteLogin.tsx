import { useObservableState } from "observable-hooks"
import { FormEventHandler, useState } from "react"
import { useAppService, useTheme, useVrmService, vrmQuery } from "../../../../modules"
import { Installations } from "../../Installations"
import { VRM_URL } from "../../../utils/constants"

import "./RemoteLogin.scss"

import KVNRVLogo from "../../../images/KVNRV-Logo.svg"
import ArrowLeftDark from "../../../images/ArrowLeft-Dark.svg"
import ArrowLeft from "../../../images/ArrowLeft.svg"
import Splash from "../../../images/Splash.svg"

export const RemoteLogin = () => {
  const { darkMode } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<any>()
  const vrmService = useVrmService()
  const appService = useAppService()
  const userId = useObservableState(vrmQuery.userId$)
  const loggedIn = useObservableState(vrmQuery.loggedIn$)
  const siteId = useObservableState(vrmQuery.siteId$)
  const installations = useObservableState(vrmQuery.installations$)

  const submitLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      await vrmService.login(email, password)
      setEmail("")
      setPassword("")
      await vrmService.updateInstanceDetails()
    } catch (e) {
      console.error(e)
      setError(e)
    }
  }

  const goBack = () => {
    appService.setRemote(false)
  }

  return (
    <div className={"login-page"}>
      <div className={"login__body"}>
        <div className={"login__logo"}>
          <img src={KVNRVLogo} alt={"KVNRV logo"} className={"login__logo__image"} />
          <span className={"login__logo__text"}>KVNRV</span>
        </div>
        {!userId && (
          <>
            <form className={"login__form"} onSubmit={submitLogin}>
              {error && <div className={"login__form__error"}>{error?.message ?? "Login failed"}</div>}

              <label className={"login__form__label"} htmlFor={"login-email"}>
                Email
              </label>
              <input
                type="email"
                id={"login-email"}
                className={`login__form__input ${error ? "invalid" : ""}`}
                value={email}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />

              <label className={"login__form__label"} htmlFor={"login-password"}>
                Password
              </label>
              <input
                type="password"
                id={"login-password"}
                className={`login__form__input ${error ? "invalid" : ""}`}
                value={password}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />

              <button className={"login__form__button login"} type={"submit"}>
                Log in
              </button>
              <button className={"login__form__button go_back"} type={"button"} onClick={goBack}>
                <img
                  src={darkMode ? ArrowLeftDark : ArrowLeft}
                  alt={"Left arrow"}
                  className={"login__form__icon__go_back"}
                />
                Go back
              </button>
            </form>

            <div className={"login__bottom"}>
              <a target={"_blank"} href={VRM_URL + "forgot-password"} rel="noreferrer">
                Forgot Password?
              </a>
            </div>
            <div className={"login__footer"}>
              <span>
                Don't have an account yet?{" "}
                <a target={"_blank"} href={VRM_URL + "register"} rel="noreferrer">
                  Register your RV.
                </a>
              </span>
            </div>
          </>
        )}
        {(loggedIn || (!siteId && installations)) && <Installations />}
      </div>
      <div className={"login__splash"}>
        <img src={Splash} alt={"Splash"} className={"login__splash__image"} />
      </div>
    </div>
  )
}

export default RemoteLogin

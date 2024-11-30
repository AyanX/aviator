import { Suspense, useState } from "react";
import "./cashier.css";
import Loading from "../../utils/loader";
import { cashier } from "../../utils/fetch_players";
import {
  Await,
  defer,
  Form,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { withdrawFunds, deposit } from "../../utils/fetch_players";

export async function depositAction({ request }) {
  const formData = await request.formData();
  const depositAmount = formData.get("deposit-value");

  if (!depositAmount) {
    return null;
  }

  const depositData = {
    depositAmount,
  };
  try {
    const res = await deposit(depositData);
    if (res.message !== "success") {
      return redirect("/cashier/manual-deposit");
    }
  } catch (e) {
    return null;
  }
}

export function ManualDeposit() {
  return (
    <div className="manual-deposit">
      <h1>TILL: 3032426</h1>
      <p>1. Strictly use your registered mobile number to pay</p>
      <p>2. Your deposit will be reflected within a max of 5 minutes</p>
      <h3>
        <span>Subject:</span> Temporary Notice: Online Deposit Unavailable
      </h3>
      <h4>
        We regret to inform you that our online M-Pesa deposit system is
        temporarily unavailable. We are working diligently to resolve the issue
        and will notify you as soon as it's back online
      </h4>
      <h4>
        In the meantime, we kindly request you to use our manual deposit option
        to continue with your transactions. Please follow these steps for a
        manual deposit
      </h4>

      <h4>
        We apologize for any inconvenience caused and sincerely appreciate your
        patience and understanding. Thank you for your cooperation
      </h4>
      <div><HomeBTn/></div>
    </div>
  );
}

export function Deposit() {
  const navigation = useNavigation();
  return (
    <div className="deposit-container">
      <div className="deposit">
        <h4>AMOUNT (KES)</h4>
        <Form method="post">
          <input type="number" placeholder="200" name="deposit-value" /> <br />
          <button type='submit'>
            {navigation?.state === "idle" ? (
              <h3>DEPOSIT</h3>
            ) : (
              <h3>DEPOSITING...</h3>
            )}
          </button>
        </Form>
      </div>
      <div className="deposit-details">
        <p>
          Your deposit is processed within 5 minutes. When there are delays,
          enter the mpesa transaction code in the form below and press Verify.
        </p>
      </div>
      <div className="deposit-verify">
        <h2>Verify pending mpesa deposit</h2>
        <p>
          We automatically verify all mpesa transactions and you may never have
          to use this step. ONLY use this if your deposit is delayed for more
          than 5 minutes.
        </p>
        <p className="ref">MPesa Reference Number</p>
        <input placeholder="eg KLHX06GHL" required /> <br />
        <button>
          <h3>VERIFY</h3>
        </button>
      </div>
      <HomeBTn />
    </div>
  );
}
export function Withdraw() {
  const loaderData = useLoaderData();
  const { balance } = loaderData;
  const [withdraw, setWithdraw] = useState(50);
  const buttonDisabled = withdraw < 50 || withdraw > balance;
  const [withdrawMessage, setWithdrawMessage] = useState(null);

  async function withdrawMyFunds(amount) {
    try {
      const res = await withdrawFunds(amount);
      console.log(res);
      if (res.message === "success") {
        return setWithdrawMessage(
          "Your request has been received and will be processed in less than 5 minutes "
        );
      }
      return setWithdrawMessage("an error occured. Please try again");
    } catch (e) {
      return setWithdrawMessage("an error occured. Please try again", e);
    }
  }
  return (
    <div className="withdrawal-container">
      <div className="withdrawal-info">
        <h2>Withholding Tax Notice</h2>
        <h5>
          As provided by the Income Tax Act, Cap 472, all gaming companies are
          required to withhold winnings at the rate of 20%. This is the
          <span> Withholding Tax</span>. In compliance with the law, we will
          deduct and remit to KRA 20% of all winnings
        </h5>
      </div>
      <div className="withdrawal-section">
        <h3>AMOUNT</h3>
        <input
          placeholder="50"
          required
          minLength="2"
          min="50"
          onChange={(e) => setWithdraw(e.target.value)}
        />
      </div>
      <div className="withdrawals-check">
        <div>
          <h5>Available Balance</h5>
          <h5>{balance}</h5>
        </div>
        <div>
          <h5>Withdrawal fee</h5>
          <h5>20%</h5>
        </div>
        <div>
          <h5>Disbursed Amount</h5>
          <h5>{withdraw > 50 ? withdraw * (4 / 5) : "-"}</h5>
        </div>
      </div>
      <button
        onClick={() => withdrawMyFunds(withdraw)}
        disabled={buttonDisabled}
      >
        <h3>WITHDRAW</h3>
      </button>
      <h3>{withdrawMessage ? withdrawMessage : null}</h3>
      <HomeBTn />
    </div>
  );
}
export function Bonus() {
  const loaderData = useLoaderData();
  const { referrals, referral_code } = loaderData;
  return (
    <div className="bonus-container">
      <Suspense fallback={<Loading />}>
        <div>
          <h2>Invite 5 friends and win ksh 500</h2>
          <h3>You currently have {referrals} reffered</h3>
          <h4>Send them the referral code below to use when signing up</h4>
          <h1 className="code-invite">{referral_code}</h1>
        </div>
        <HomeBTn />
      </Suspense>
    </div>
  );
}

function HomeBTn() {
  return (
    <Link to="/">
      <button className="home-btn">HOME</button>
    </Link>
  );
}

export async function loader() {
  const data = cashier();
  return defer({ data });
}

const Cashier = () => {
  const loaderData = useLoaderData();

  function CashierData() {
    return (
      <Suspense
        fallback={
          <div className="loaderCahier">
            <Loading />
          </div>
        }
      >
        <Await resolve={loaderData.data}>
          {(data) => {
            if (data?.message !== "Log in first") {
              return <Outlet />;
            }
            return (
              <div className="loaderCashier">
                <Loading />
                <button style={{ marginTop: "10px" }}>
                  <Link to="/">
                    <h3>HOME</h3>
                  </Link>
                </button>
              </div>
            );
          }}
        </Await>
      </Suspense>
    );
  }

  return (
    <div className="cashier-wrapper">
      <div className="cashier-container">
        <nav>
          <ul>
            <li>
              <Link to="/cashier">
                <h3> DEPOSIT</h3>
              </Link>
            </li>
            <li>
              <Link to="/cashier/withdraw">
                <h3>WITHDRAW</h3>
              </Link>
            </li>
            <li>
              <Link to="/cashier/bonus">
                <h3>BONUS</h3>
              </Link>
            </li>
          </ul>
        </nav>
        <CashierData />
      </div>
    </div>
  );
};

export default Cashier;

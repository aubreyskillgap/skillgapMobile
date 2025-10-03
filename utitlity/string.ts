export const formatMoney = (money: number): { left: string; right: string } => {
  const [integer, decimal] = money.toFixed(2).split(".");
  const left = Number(integer).toLocaleString(); // adds commas
  const right = decimal;
  return { left, right };
};

export const generateTxnRef = () => {
  const rand = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;

  return `${Date.now().toString()}_${rand}`;
};

export const fixCurrency =()=>{
  // take a number
  // get the sign save in const var
  // get abs of number

  // return {absNum, sign}
}
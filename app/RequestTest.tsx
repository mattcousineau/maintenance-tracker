import { Card, Heading } from "@radix-ui/themes";

const RequestTest = () => {
  const obj = {
    name: "Test Obj",
    date: "01/02/1921",
    active: "true",
  };

  return (
    <Card className="mb-5">
      <Heading size="4" mb="5">
        Message of the Day
      </Heading>
      <p>Reminder that Phil will be out on vacation the week of 7/7 - 7/11.</p>
      <p>
        We are still looking for someone to take overtime to cover his shifts
        during that time.
      </p>
    </Card>
  );
};

export default RequestTest;

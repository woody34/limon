export default function () {
  return (
    <div class="flex flex-col">
      <form method="post" action="/auth/api/register">
        <input defaultValue="" type="text" name="firstName" />
        <input defaultValue="" type="text" name="lastName" />
        <input defaultValue="" type="text" name="email" />
        <input defaultValue="" type="password" name="password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

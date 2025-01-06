export default function Dashboard() {
  return (
    <>
      <h1>This is dashboard...</h1>
      
      <form action="/auth/logout" method="POST">
              <button
                type="submit"
              >
                Log me out
              </button>
            </form>
    </>
  );
}

import ClientWrapper from './ClientWrapper';
import getUsers from '@/lib/getUsers';


export default async function SignedIn() {
  const others = await getUsers();
  return (
    <ClientWrapper others={others} />
  );
}

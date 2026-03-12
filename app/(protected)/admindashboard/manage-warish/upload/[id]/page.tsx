import ClientPage from "./ClientPage";

export default function WarishDocumentUpload({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // We cannot use async/await in a Client Component signature; keep this as a Server Component wrapper
  // and pass the id down via a React prop after awaiting params in a server context.
  const idPromise = params;
  // eslint-disable-next-line react/display-name
  return (async () => {
    const { id } = await idPromise;
    return <ClientPage id={id} />;
  })() as unknown as JSX.Element;
}

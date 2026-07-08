import ReserveForm from "./ReserveForm";

type Props = {
  params: Promise<{
    product: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { product } = await params;

  return <ReserveForm product={product} />;
}

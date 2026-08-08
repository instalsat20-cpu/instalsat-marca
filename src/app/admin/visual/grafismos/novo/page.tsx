import { PageTitle } from "@/components/page-title";
import { ElementForm } from "@/components/admin/element-form";

export default function NovoElementoPage() {
  return (
    <div>
      <PageTitle title="Novo elemento gráfico" />
      <ElementForm />
    </div>
  );
}

const PASSOS = [
  { numero: '1', titulo: 'Conte', exemplo: '“Perdi renda este mês.”' },
  { numero: '2', titulo: 'Confirme', exemplo: 'Carteira assinada? Renda da casa?' },
  { numero: '3', titulo: 'Procure', exemplo: 'CRAS, SUS, INSS ou Defensoria.' },
];

export function DemonstracaoRota() {
  return (
    <div className="dv-route" aria-label="Como a orientação funciona">
      <div className="dv-route__line" aria-hidden="true" />
      {PASSOS.map((passo) => (
        <div className="dv-route__step" key={passo.titulo}>
          <span>{passo.numero}</span>
          <div>
            <strong>{passo.titulo}</strong>
            <p>{passo.exemplo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Routes } from '@angular/router';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';
import { SelecaoServicoComponent } from './components/selecao-servico/selecao-servico.component';
import { SelecaoBarbeiroComponent } from './components/selecao-barbeiro/selecao-barbeiro.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cadastro', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroClienteComponent },
  { path: 'servicos', component: SelecaoServicoComponent },
  { path: 'barbeiros', component: SelecaoBarbeiroComponent },
  { path: 'agendamento', component: AgendamentoComponent }
];


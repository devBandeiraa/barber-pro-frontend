import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroClienteComponent } from './components/cadastro-cliente/cadastro-cliente.component';
import { SelecaoServicoComponent } from './components/selecao-servico/selecao-servico.component';
import { SelecaoBarbeiroComponent } from './components/selecao-barbeiro/selecao-barbeiro.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { DashboardBarbeiroComponent } from './components/dashboard-barbeiro/dashboard-barbeiro.component';
import { GestaoClientesComponent } from './components/gestao-clientes/gestao-clientes.component';
import { PainelAdminComponent } from './components/painel-admin/painel-admin.component';
import { LoginBarbeiroComponent } from './components/login-barbeiro/login-barbeiro.component';
import { authGuard } from './guards/auth.guard';
import { UserRole } from './services/auth.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login-barbeiro', component: LoginBarbeiroComponent },
  { path: 'cadastro', component: CadastroClienteComponent },
  { path: 'servicos', component: SelecaoServicoComponent },
  { path: 'barbeiros', component: SelecaoBarbeiroComponent },
  { path: 'agendamento', component: AgendamentoComponent },
  { 
    path: 'dashboard', 
    component: DashboardBarbeiroComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.BARBEIRO, UserRole.ADMIN] }
  },
  { 
    path: 'admin', 
    component: PainelAdminComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'clientes', 
    component: GestaoClientesComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.ADMIN] }
  }
];


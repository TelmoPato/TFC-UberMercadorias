Uber de Transporte de Mercadorias
Texto e imagem para apresentação do trabalho
O projeto "Uber de Transporte de Mercadorias" é uma plataforma digital inovadora desenvolvida para revolucionar o setor de transporte de mercadorias. Utilizando tecnologias avançadas como Spring Framework, PostgreSQL, Flutter e Google Maps API, a aplicação oferece uma solução eficiente, flexível e segura para conectar motoristas independentes a consumidores que necessitam de serviços de transporte. A plataforma destaca-se pela sua interface intuitiva, otimização de rotas em tempo real e autenticação segura via JWT. Com foco na sustentabilidade e eficiência operacional, este projeto visa transformar a logística de mercadorias, tornando-a mais acessível e adaptável às necessidades dos utilizadores.



Desenvolvedores
Telmo Flores Pato
Tomas Damaso Maria

Orientador: Rui Santos
Direitos de Cópia
Este trabalho é protegido por direitos autorais e foi publicado com permissão para uso acadêmico e pesquisa, conforme regulamento da Universidade Lusófona.

Resumo do Projeto
O projeto desenvolve uma plataforma digital para otimizar o transporte de mercadorias utilizando tecnologia de ponta e um foco na experiência do usuário. O sistema é projetado para ser acessível, transparente e adaptável às necessidades variadas do mercado, oferecendo uma solução integrada para clientes e transportadores.

Tecnologias Utilizadas
Frontend: Flutter
Backend: Spring Boot
BackOffice: Next.js
Base de Dados: PostgreSQL
IDEs: IntelliJ IDEA, Android Studio, Visual Studio
Controle de Versão: Git, hospedado no GitHub
Características Principais
Interface intuitiva para solicitação e gestão de transportes
Sistema de cálculo de custos baseado em dimensões e distâncias
Suporte para diferentes modelos de transporte, incluindo reboques
Acompanhamento em tempo real e histórico de transportes


Instalação

# Necessario ter instalado:
-java 17 ou maior
-flutter
-node.js 

# Clone este repositório
git clone https://github.com/TelmoPato/TFC-UberMercadorias.git

# Entre no repositório
cd Trabalho-Final-de-Curso

# Instale as dependências
# Para o backend
cd backend
./mvnw install

# Para o frontend
cd ../frontend
flutter pub get

# Inicie o servidor backend
./mvnw spring-boot:run

# Inicie a aplicação frontend
flutter run

# Para o BackOffice
cd ../Trabalho-Final-de-Curso\BackOffice\tfc-backoffice

#Inicie o site BackOffice
npm run dev


Licença
Este projeto está sob a licença da Universidade Lusófona. Veja o arquivo LICENSE para mais detalhes.

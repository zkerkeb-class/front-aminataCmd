const BDD_BASE_URL = import.meta.env.VITE_BDD_SERVICE_URL;
const PLANNING_BASE_URL = import.meta.env.VITE_PLANNING_SERVICE_URL;

// Types pour les réponses API
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Service pour les tournois
export const tournamentsService = {
  async getTournaments() {
    try {
      const response = await fetch(`${BDD_BASE_URL}/tournaments/`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any[]> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des tournois:", error.message);
      throw error;
    }
  }
};

// Service pour les plannings
export const planningService = {
  async getPlanningByTournament(tournamentId: string) {
    try {
      const response = await fetch(`${PLANNING_BASE_URL}/planning/tournament/${tournamentId}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du planning:", error.message);
      throw error;
    }
  },

  async generatePlanning(tournamentId: string) {
    try {
      const response = await fetch(`${PLANNING_BASE_URL}/planning/generate`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tournament_id: tournamentId })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la génération du planning:", error.message);
      throw error;
    }
  }
};

// Service pour les utilisateurs
export const usersService = {
  async getUserByEmail(email: string, retryCount = 0) {
    try {
      const response = await fetch(`${BDD_BASE_URL}/users/?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any> = await response.json();

      // Si l'utilisateur n'est pas trouvé mais une invitation a été envoyée
      if (!responseJson.data && responseJson.message.includes("invitation envoyée")) {
        
        // Attendre 2 secondes et réessayer (maximum 3 tentatives)
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.getUserByEmail(email, retryCount + 1);
        } else {
          throw new Error(`Impossible de récupérer l'utilisateur ${email} après plusieurs tentatives`);
        }
      }

      return responseJson.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${email}:`, error.message);
      throw error;
    }
  }
};

// Service pour les équipes
export const teamsService = {
  async getTeams() {
    try {
      const response = await fetch(`${BDD_BASE_URL}/teams/`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any[]> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes:", error.message);
      throw error;
    }
  },

  async getTeamsWithMembers() {
    try {
      const response = await fetch(`${BDD_BASE_URL}/teams/with-members`, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any[]> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes avec membres:", error.message);
      throw error;
    }
  },

    async createTeam(tournament_id: string, teamData: any) {
        try {
            const response = await fetch(`${BDD_BASE_URL}/tournaments/${tournament_id}/teams/`, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(teamData)
            });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error.message);
      throw error;
    }
  },

  async addPlayersToTeam(teamId: string, players: any[]) {
    try {
      const response = await fetch(`${BDD_BASE_URL}/tournaments/teams/${teamId}/members`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          team_id: teamId,
          players: players
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseJson: ApiResponse<any> = await response.json();
      return responseJson.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout des joueurs à l'équipe:", error.message);
      throw error;
    }
  }
}; 
import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    constructor() {
        this.callApi = callApi;
    }

    async getFighters() {
        try {
            return await this.callApi(this.#endpoint);
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            return await this.callApi(`details/fighter/${id}.json`);
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;

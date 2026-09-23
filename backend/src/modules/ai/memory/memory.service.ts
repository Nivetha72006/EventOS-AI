import repository from "./memory.repository";
import { CreateMemoryDto } from "./memory.dto";

class MemoryService{

    save(data:CreateMemoryDto){

        return repository.create(data);

    }

    load(eventId:string){

        return repository.getEventMemory(eventId);

    }

}

export default new MemoryService();
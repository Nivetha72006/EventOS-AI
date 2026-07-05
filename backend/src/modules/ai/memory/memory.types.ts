export interface EventMemory {

  event: {

    id:string;

    title:string;

    type:string;

    city:string;

    budget:number;

    guestCount:number;

    date:string;

  };

  preferences:{

    theme?:string;

    colors?:string[];

    foodType?:string;

    stageStyle?:string;

    dressStyle?:string;

    invitationStyle?:string;

  };

  selectedVendors:{

    catering?:string;

    decoration?:string;

    photography?:string;

    makeup?:string;

    venue?:string;

  };

  planner:{

    completedTasks:string[];

    pendingTasks:string[];

  };

  negotiation:{

    vendor:string;

    originalPrice:number;

    negotiatedPrice:number;

  }[];

  notes:string[];

}
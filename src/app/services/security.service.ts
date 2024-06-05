import { Injectable } from '@angular/core';
import { Security } from '../state-managements/models/security.model';

@Injectable()
export class SecurityService {
    repo : Security[] = [];

    //test : string[] = ['BB KAIMOOK','BAHTERA INTAN','BB LIBERTY 209','BB TONGKAM'];
    test : string[] = ['BB LIBERTY 209'];
    bb_chevron : string[] = [];
    bb_ptt : string[] = ['BAHTERA MAKMUR','BB GOMEN','BAHTERA MULIA','BB KAIMOOK','BAHTERA INTAN','BB LIBERTY 209','BB TONGKAM','BB PHET','BB JINDAMANEE'];
    sc_chevron : string[] = ['SC GLORY 2','SC GLORY 6','SC GLORY 7','SC EMERALD','SC BONGKOT','SC BRAVE','SC SULTAN', 'SC RAJA'];
    sc_ptt : string[] = ['SC PAILIN','SC WINTER','SC GLORY 1','SC GLORY 3', 'SC CHOLUEDEE', 'SC CHOLRUEDEE','SC BONGKOT'];

    obsolete: string[] = ['BB BUSSARAKHAM'];

    chevron : string[] = [...this.sc_chevron, ...this.bb_chevron];
    ptt : string[] = [...this.sc_ptt, ...this.bb_ptt];

    bb : string[] = [...this.bb_chevron, ...this.bb_ptt];
    sc : string[] = [...this.sc_chevron, ...this.sc_ptt];
    all: string[] = [...this.chevron, ...this.ptt, ...this.test];

    constructor() { 
        this.repo.push({username:'scbrave', vesselNames:['SC BRAVE']});
        this.repo.push({username:'scemerald', vesselNames:['SC EMERALD']});
        this.repo.push({username:'scglory2', vesselNames:['SC GLORY 2']});
        this.repo.push({username:'scglory6', vesselNames:['SC GLORY 6']});
        this.repo.push({username:'scglory7', vesselNames:['SC GLORY 7']});
        this.repo.push({username:'scsultan', vesselNames:['SC SULTAN']});
        this.repo.push({username:'scraja', vesselNames:['SC RAJA']});

        this.repo.push({username:'bbkaimook',vesselNames:['BB KAIMOOK']})

        this.repo.push({username:'sat', vesselNames:[...this.all]});
        this.repo.push({username:'chatri', vesselNames:[...this.all]});
        
        //This User supplied for Chevron Customer at the beginning of project.
        this.repo.push({username:'sc', vesselNames:[...this.sc_chevron]});
        
        this.repo.push({username:'bbuser', vesselNames:[...this.bb]});
        this.repo.push({username:'scuser', vesselNames:[...this.sc]});
        this.repo.push({username:'chevronuser', vesselNames:[...this.chevron]});
        this.repo.push({username:'pttuser', vesselNames:[...this.ptt]});

        this.repo.push({username:'pttsc', vesselNames:[...this.sc_ptt]});

    }

    hasAccess(vesselName : string):boolean
    {
        var username = localStorage.getItem('username');
        var result = this.repo.filter(x => x.username.toLocaleLowerCase() == username.toLocaleLowerCase())
                                .filter(x => x.vesselNames.includes(vesselName.toUpperCase()));
       
        if(result && result.length > 0) { return true; }
        else { return false; }
    }   
}
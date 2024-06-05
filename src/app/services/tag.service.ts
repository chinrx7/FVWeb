import { Injectable } from '@angular/core';

@Injectable()
export class TagService {
    public tagSelected: TagGroup[] = []
    public presetConfig: any[]
    public points: Point[] = []
    constructor() { }

    setActive(tag: any, group: any) {
        if (tag.check) {
            this.tagSelected.push({
                group: group.group,
                tags: tag.name
            })
        }
        else {
            this.tagSelected = this.tagSelected.filter(x => {
                return x.tags != tag.name
            })
        }
    }

    clearTagSelected() {
        this.tagSelected = []
    }

    setPresetConfig(res: any[]) {
        this.presetConfig = res
    }

    addPoint(prefix: string, points: any[]) {
        if (this.points.filter(x => x.prefix == prefix).length == 0) {
            this.points.push({
                prefix: prefix,
                points: points
            })
        }
    }

    hasPoint(prefix: string): boolean {
        let count = this.points.filter(x => x.prefix == prefix).length
        return (count > 0) ? true : false

    }

    getPoint(prefix: string): any[] {
        let point = this.points.filter(x => x.prefix == prefix)
        return (point.length > 0) ? point[0].points : null

    }
}


export class TagGroup {
    constructor(public group: string[], public tags: string) { }
}

export class Point {
    constructor(public prefix: string, public points: any[]) { }
}
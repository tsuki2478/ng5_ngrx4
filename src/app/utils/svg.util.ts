import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

export const loadSvgResources = (ir: MdIconRegistry, ds: DomSanitizer) => {

    const everyday = '../../assets/days';
    const avatarDir = '../../assets/avatar';
    const iconDir = `../../assets/icons`;
    ir.addSvgIcon('projects', ds.bypassSecurityTrustResourceUrl('../../assets/icons/projects.svg'));
    ir.addSvgIcon('project', ds.bypassSecurityTrustResourceUrl('../../assets/icons/project.svg'));
    ir.addSvgIcon('month', ds.bypassSecurityTrustResourceUrl('../../assets/icons/month.svg'));
    ir.addSvgIcon('day', ds.bypassSecurityTrustResourceUrl('../../assets/icons/day.svg'));
    ir.addSvgIcon('week', ds.bypassSecurityTrustResourceUrl('../../assets/icons/week.svg'));
    ir.addSvgIcon('move', ds.bypassSecurityTrustResourceUrl('../../assets/icons/move.svg'));
    ir.addSvgIcon('add', ds.bypassSecurityTrustResourceUrl('../../assets/icons/add.svg'));
    ir.addSvgIcon('delete', ds.bypassSecurityTrustResourceUrl('../../assets/icons/delete.svg'));
    ir.addSvgIcon(`unassigned`, ds.bypassSecurityTrustResourceUrl(`${avatarDir}/unassigned.svg`));

    ir.addSvgIconSetInNamespace(`avatars`, ds.bypassSecurityTrustResourceUrl(`${avatarDir}/avatars.svg`));


    const days = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ];
    days.forEach(d => ir.addSvgIcon(`day${d}`, ds.bypassSecurityTrustResourceUrl(`${everyday}/day${d}.svg`)));

}
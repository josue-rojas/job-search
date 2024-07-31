import { LinkedIn } from "./Linkedin";
import { SourceBase } from "./SourceBase";

export enum SourceType {
  LinkedIn
};


interface SourceFactoryOptions {

}

// store in memory so we wont have to create another class
// const sources: {[s: string]: SourceBase } = {}

export class SourceFactory {
  static createSource(type: SourceType, _options?: SourceFactoryOptions): SourceBase {
    switch (type) {
      case SourceType.LinkedIn:
        return new LinkedIn();
      default:
        throw new Error(`${type} - not yet implemented`);
    }
  }
}

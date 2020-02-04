import { MagitRepository } from "../models/magitRepository";
import { MenuUtil, MenuState } from "../menu/menu";
import { commands, window, workspace, Uri } from "vscode";
import LogView from "../views/logView";
import { views } from "../extension";
import MagitUtils from "../utils/magitUtils";
import FilePathUtils from "../utils/filePathUtils";

const loggingMenu = {
  title: 'Logging',
  commands: [
    { label: 'c', description: 'Log current', action: logHead },
    { label: 'h', description: 'Log HEAD', action: logHead },
  ]
};

export async function logging(repository: MagitRepository) {
  return MenuUtil.showMenu(loggingMenu, { repository });
}

async function logHead({ repository }: MenuState) {

  if (repository.magitState?.HEAD) {

    const log = await repository.log({ maxEntries: 100 });

    const uri = LogView.encodeLocation(repository);
    views.set(uri.toString(), new LogView(uri, { commits: log, refName: repository.magitState?.HEAD.name! }));
    workspace.openTextDocument(uri)
      .then(doc => window.showTextDocument(doc, MagitUtils.oppositeActiveViewColumn(), true));
  }
}